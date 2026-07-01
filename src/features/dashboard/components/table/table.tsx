import { DataGrid, GridColDef } from "@mui/x-data-grid";
import type { AppData } from "../../../../types";

type TableProps = {
  data: AppData[];
  startDate: string;
  endDate: string;
};

type AppRow = {
  id: number;
  appName: string;
  downloads: number;
};

const Table = ({ data, startDate, endDate }: TableProps) => {
  void startDate;
  void endDate;

  if (!data.length) {
    return null;
  }

  const columns: GridColDef<AppRow>[] = [
    { field: "appName", headerName: "App Name", width: 150 },
    { field: "downloads", headerName: "Downloads", width: 150 },
  ];

  const rows = data.map((appData) => {
    const totalDownloads = 42;
    const row: AppRow = {
      id: appData.id,
      appName: appData.name,
      downloads: totalDownloads,
    };
    return row;
  });

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid rows={rows} columns={columns} />
    </div>
  );
};

export default Table;
