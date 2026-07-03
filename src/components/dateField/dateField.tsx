import TextField from "@mui/material/TextField";

type DateFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

const DateField = ({ id, label, value, onChange }: DateFieldProps) => {
  return (
    <TextField
      id={id}
      label={label}
      type="date"
      value={value}
      size="small"
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        inputLabel: { shrink: true },
      }}
    />
  );
};

export default DateField;
