import { useMemo, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "../../../../config/highcharts";
import type { AppData, Measure } from "../../../../types";
import { dayjsUtc } from "../../../../config/dayjs";
import { filterByDateRange } from "../../utils/filterData/filterData";
import {
  formatDateRange,
  formatChartAxisDate,
} from "../../../../utils/formatDate/formatDate";
import Loading from "./loading/loading";
import MeasureToggle from "./measureToggle/measureToggle";
import "./chart.css";

type ChartProps = {
  data: AppData[];
  isLoading: boolean;
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

const NO_DATA_MESSAGE = "No data available";
const NO_DATA_IN_RANGE_MESSAGE = "No data for the selected date range";

const Chart = ({ data, isLoading, startDate, endDate }: ChartProps) => {
  const [measure, setMeasure] = useState<Measure>("downloads");

  const seriesData = useMemo<Highcharts.SeriesOptionsType[]>(() => {
    return data.map((series) => {
      const filteredData = filterByDateRange(series.data, startDate, endDate);

      return {
        name: series.name,
        type: "line",
        data: filteredData.map(([date, downloads, revenueCents]) => {
          const dateMs = dayjsUtc(date).valueOf();
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

  const noDataMessage = !data.length
    ? NO_DATA_MESSAGE
    : NO_DATA_IN_RANGE_MESSAGE;

  const chartOptions = useMemo<Highcharts.Options>(
    () => ({
      lang: {
        noData: noDataMessage,
      },
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
    }),
    [measure, startDate, endDate, seriesData, noDataMessage],
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="chart">
      {data.length > 0 && (
        <div className="chart__header">
          <MeasureToggle value={measure} onChange={setMeasure} />
        </div>
      )}
      <HighchartsReact highcharts={Highcharts} options={chartOptions} />
    </div>
  );
};

export default Chart;
