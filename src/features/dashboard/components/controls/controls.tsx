import DateField from "../../../../components/dateField/dateField";
import MeasureToggle from "./measureToggle/measureToggle";
import type { Measure } from "../../../../types";
import "./controls.css";

type ControlsProps = {
  startDate: string;
  endDate: string;
  measure: Measure;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
  onMeasureChange: (measure: Measure) => void;
};

const Controls = ({
  startDate,
  endDate,
  measure,
  onStartDateChange,
  onEndDateChange,
  onMeasureChange,
}: ControlsProps) => {
  return (
    <div className="controls">
      <DateField
        id="start-date"
        label="Start Date"
        value={startDate}
        onChange={onStartDateChange}
      />
      <DateField
        id="end-date"
        label="End Date"
        value={endDate}
        onChange={onEndDateChange}
      />
      <MeasureToggle value={measure} onChange={onMeasureChange} />
    </div>
  );
};

export default Controls;
