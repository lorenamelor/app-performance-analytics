import DateField from "../../../../components/dateField/dateField";
import "./controls.css";

const INVALID_RANGE_MESSAGE = "End date must be on or after start date.";

type ControlsProps = {
  startDate: string;
  endDate: string;
  isInvalidRange: boolean;
  onStartDateChange: (value: string) => void;
  onEndDateChange: (value: string) => void;
};

const Controls = ({
  startDate,
  endDate,
  isInvalidRange,
  onStartDateChange,
  onEndDateChange,
}: ControlsProps) => {
  return (
    <div className="controls">
      <DateField
        id="start-date"
        label="Start Date"
        value={startDate}
        error={isInvalidRange ? INVALID_RANGE_MESSAGE : undefined}
        onChange={onStartDateChange}
      />
      <DateField
        id="end-date"
        label="End Date"
        value={endDate}
        error={isInvalidRange ? INVALID_RANGE_MESSAGE : undefined}
        onChange={onEndDateChange}
      />
    </div>
  );
};

export default Controls;
