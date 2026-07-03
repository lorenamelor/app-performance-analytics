import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import type { Measure } from "../../../types";
import "./measureToggle.css";

type MeasureToggleProps = {
  value: Measure;
  onChange: (measure: Measure) => void;
};

const OPTIONS: { value: Measure; label: string }[] = [
  { value: "downloads", label: "Downloads" },
  { value: "revenue", label: "Revenue" },
];

const MeasureToggle = ({ value, onChange }: MeasureToggleProps) => {
  const handleMeasureChange = (
    _: React.MouseEvent<HTMLElement>,
    newValue: Measure | null,
  ) => {
    if (newValue !== null) {
      onChange(newValue);
    }
  };

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      aria-label="Measure"
      className="measureToggle"
      onChange={handleMeasureChange}
    >
      {OPTIONS.map((option) => (
        <ToggleButton
          key={option.value}
          value={option.value}
          aria-label={option.label}
        >
          {option.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};

export default MeasureToggle;
