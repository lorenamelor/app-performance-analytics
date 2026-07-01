import { useMemo } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import type { AppData } from "../../../../types";
import { filterByDateRange } from "../../utils/filterData/filterData";
import { aggregateAppMetrics } from "../../utils/aggregateData/aggregateData";
import { formatNumber } from "../../../../utils/formatNumber/formatNumber";
import {
  formatCurrency,
  formatCurrencyFromCents,
} from "../../../../utils/formatCurrency/formatCurrency";
import "./table.css";

type TableProps = {
  data: AppData[];
  startDate: string;
  endDate: string;
};

type AppRow = {
  id: number;
  appName: string;
  downloads: number;
  revenueCents: number;
  rpd: number | null;
};

const Table = ({ data, startDate, endDate }: TableProps) => {
  const rows = useMemo<AppRow[]>(() => {
    return data.map((appData) => {
      const filteredData = filterByDateRange(appData.data, startDate, endDate);
      const { downloads, revenueCents, rpd } = aggregateAppMetrics(filteredData);

      return {
        id: appData.id,
        appName: appData.name,
        downloads,
        revenueCents,
        rpd,
      };
    });
  }, [data, startDate, endDate]);

  const columns = useMemo<GridColDef<AppRow>[]>(
    () => [
      { field: "appName", headerName: "App Name", width: 150 },
      {
        field: "downloads",
        headerName: "Downloads",
        width: 150,
        valueFormatter: (value) => formatNumber(value as number),
      },
      {
        field: "revenueCents",
        headerName: "Revenue",
        width: 150,
        valueFormatter: (value) => formatCurrencyFromCents(value as number),
      },
      {
        field: "rpd",
        headerName: "RPD",
        width: 150,
        valueFormatter: (value) =>
          value === null ? "-" : formatCurrency(value as number),
      },
    ],
    [],
  );

  if (!data.length) {
    return null;
  }

  return (
    <div className="table">
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default Table;
