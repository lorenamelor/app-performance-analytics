import { useMemo, useState } from "react";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "../../../../config/highcharts";
import Card from "../../../../components/card/card";
import type { AppData, Measure } from "../../types";
import { dayjsUtc } from "../../../../config/dayjs";
import {
  formatDateRange,
  formatChartAxisDate,
} from "../../../../utils/formatDate/formatDate";
import MeasureToggle from "./measureToggle/measureToggle";
import Loading from "./loading/loading";
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

const Chart = ({ data, isLoading, startDate, endDate }: ChartProps) => {
  const [measure, setMeasure] = useState<Measure>("downloads");

  const seriesData = useMemo<Highcharts.SeriesOptionsType[]>(() => {
    return data.map((series) => ({
      name: series.name,
      type: "line",
      data: series.data.map(([date, downloads, revenueCents]) => {
        const dateMs = dayjsUtc(date).valueOf();
        const yValue =
          measure === "downloads" ? downloads : revenueCents / 100;
        return {
          x: dateMs,
          y: yValue,
        };
      }),
    }));
  }, [data, measure]);

  const noDataMessage = !data.length
    ? "No data available"
    : "No data for the selected date range";

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

  return (
    <Card className="chart">
      <div className="chart__header">
        {!isLoading && <MeasureToggle value={measure} onChange={setMeasure} />}
      </div>

      <div className="chart__content">
        {isLoading ? (
          <Loading />
        ) : (
          <HighchartsReact
            highcharts={Highcharts}
            options={chartOptions}
            containerProps={{ style: { height: 400 } }}
          />
        )}
      </div>

      <p className="chart__hint">
        <span className="chart__hintIcon" aria-hidden="true">
          ⓘ
        </span>
        Hover over the chart lines to interactively isolate and highlight any
        specific application.
      </p>
    </Card>
  );
};

export default Chart;
