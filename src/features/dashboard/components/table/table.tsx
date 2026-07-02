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
import IconLabel from "./iconLabel/iconLabel";
import "./table.css";

type TableProps = {
  data: AppData[];
  isLoading: boolean;
  startDate: string;
  endDate: string;
};

type AppRow = {
  id: number;
  appName: string;
  icon: string;
  downloads: number;
  revenueCents: number;
  rpd: number | null;
};

const Table = ({ data, isLoading, startDate, endDate }: TableProps) => {
  const rows = useMemo<AppRow[]>(() => {
    return data.map((appData) => {
      const filteredData = filterByDateRange(appData.data, startDate, endDate);
      const { downloads, revenueCents, rpd } = aggregateAppMetrics(filteredData);

      return {
        id: appData.id,
        appName: appData.name,
        icon: appData.icon,
        downloads,
        revenueCents,
        rpd,
      };
    });
  }, [data, startDate, endDate]);

  const columns = useMemo<GridColDef<AppRow>[]>(
    () => [
      {
        field: "appName",
        headerName: "App Name",
        width: 200,
        renderCell: ({ row }) => (
          <IconLabel icon={row.icon} label={row.appName} />
        ),
      },
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

  if (!isLoading && !data.length) {
    return null;
  }

  return (
    <div className="table">
      <DataGrid rows={rows} columns={columns} loading={isLoading} />
    </div>
  );
};

export default Table;
