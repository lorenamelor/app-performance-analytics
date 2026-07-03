import DateField from "../../../../components/dateField/dateField";
import "./controls.css";

type ControlsProps = {
  startDate: string;
  endDate: string;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
};

const Controls = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
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
    </div>
  );
};

export default Controls;
