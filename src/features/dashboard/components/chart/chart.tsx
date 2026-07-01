import { useMemo, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import * as Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import type { AppData, Measure } from "../../../../types";
import { dayjsUtc } from "../../../../config/dayjs";
import { filterByDateRange } from "../../utils/filterData/filterData";
import { formatDateRange, formatChartAxisDate } from "../../../../utils/formatDate/formatDate";
import "./chart.css";

type ChartProps = {
  data: AppData[];
  isLoading: boolean;
  measure: Measure;
  startDate: string;
  endDate: string;
};

const CHART_TITLE: Record<Measure, string> = {
  downloads: "Downloads by App",
  revenue: "Revenue by App",
};

const CHART_Y_AXIS_TITLE: Record<Measure, string> = {
  downloads: "Downloads",
  revenue: "Revenue ($)",
};

const Chart = ({ data, isLoading, measure, startDate, endDate }: ChartProps) => {
  const chartComponentRef = useRef<HighchartsReact.RefObject>(null);
  const seriesData = useMemo<Highcharts.SeriesOptionsType[]>(() => {
    return data.map((series) => {
      const filteredData = filterByDateRange(series.data, startDate, endDate);

      return {
        name: series.name,
        type: "line",
        data: filteredData.map(([date, downloads, revenueCents]) => {
          const dateMs = dayjsUtc(date).valueOf(); // convert date string to unix milliseconds
          const yValue =
            measure === "downloads" ? downloads : revenueCents / 100;
          return {
            x: dateMs,
            y: yValue,
          };
        }),
      };
    });
  }, [data, measure, startDate, endDate]);

  if (isLoading) {
    return (
      <div className="chart chart--loading" role="status" aria-label="Loading chart">
        <CircularProgress />
      </div>
    );
  }

  if (!seriesData.length) {
    return null;
  }

  const options: Highcharts.Options = {
    title: {
      text: CHART_TITLE[measure],
    },
    subtitle: {
      text: formatDateRange(startDate, endDate),
    },
    yAxis: {
      title: {
        text: CHART_Y_AXIS_TITLE[measure],
      },
    },
    xAxis: {
      type: "datetime",
      labels: {
        formatter: function () {
          return formatChartAxisDate(this.value as number);
        },
      },
    },
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "middle",
    },
    plotOptions: {
      series: {
        marker: {
          enabled: false,
          states: {
            hover: {
              enabled: false,
            },
          },
        },
      },
    },
    series: seriesData,
  };

  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      ref={chartComponentRef}
    />
  );
};

export default Chart;
