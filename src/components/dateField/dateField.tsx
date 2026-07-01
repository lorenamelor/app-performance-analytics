import "./dateField.css";

type DateFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const DateField = ({ id, label, value, onChange }: DateFieldProps) => {
  return (
    <p className="dateField">
      <label htmlFor={id}>{label}:</label>{" "}
      <input
        id={id}
        type="date"
        className="dateField__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </p>
  );
};

export default DateField;
