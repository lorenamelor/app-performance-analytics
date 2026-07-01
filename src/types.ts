export type AppDataTuple = [
  date: string,
  downloads: number,
  revenue: number,
];

export type AppData = {
  id: number;
  name: string;
  icon: string;
  data: AppDataTuple[];
};

export type Measure = "downloads" | "revenue";
