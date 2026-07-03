import { useMemo } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Card from "../../../../components/card/card";
import type { AppData } from "../../types";
import { filterByDateRange } from "../../utils/filterData/filterData";
import { aggregateAppMetrics } from "../../utils/aggregateData/aggregateData";
import { formatNumber } from "../../../../utils/formatNumber/formatNumber";
import {
  formatCurrency,
  formatCurrencyFromCents,
} from "../../../../utils/formatCurrency/formatCurrency";
import { dayjsUtc } from "../../../../config/dayjs";
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
        flex: 2,
        renderCell: ({ row }) => (
          <IconLabel icon={row.icon} label={row.appName} />
        ),
      },
      {
        field: "downloads",
        headerName: "Downloads",
        flex: 1,
        headerAlign: "right",
        align: "right",
        valueFormatter: (value) => formatNumber(value as number),
      },
      {
        field: "revenueCents",
        headerName: "Revenue",
        flex: 1,
        headerAlign: "right",
        align: "right",
        valueFormatter: (value) => formatCurrencyFromCents(value as number),
      },
      {
        field: "rpd",
        headerName: "RPD",
        flex: 1,
        headerAlign: "right",
        align: "right",
        valueFormatter: (value) =>
          value === null ? "-" : formatCurrency(value as number),
      },
    ],
    [],
  );

  return (
    <Card className="table">
      <header className="table__header">
        <h2 className="table__title">Application Performance Breakdown</h2>
        <p className="table__subtitle">
          {`Dynamic cumulative performance metrics between ${dayjsUtc(startDate).format("MMM DD, YY'")} and ${dayjsUtc(endDate).format("MMM DD, YY'")}`}
        </p>
      </header>

      <div className="table__grid">
        <DataGrid
          rows={rows}
          columns={columns}
          loading={isLoading}
          showCellVerticalBorder={false}
          showColumnVerticalBorder={false}
          localeText={{ noRowsLabel: "No data available" }}
        />
      </div>
    </Card>
  );
};

export default Table;
