import Button from "../../../../../components/button/button";
import type { Measure } from "../../../../../types";

type MeasureToggleProps = {
  value: Measure;
  onChange: (measure: Measure) => void;
};

const OPTIONS: { value: Measure; label: string }[] = [
  { value: "downloads", label: "Downloads" },
  { value: "revenue", label: "Revenue" },
];

const MeasureToggle = ({ value, onChange }: MeasureToggleProps) => {
  return (
    <div className="measureToggle">
      {OPTIONS.map((option) => (
        <Button
          key={option.value}
          selected={value === option.value}
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default MeasureToggle;
