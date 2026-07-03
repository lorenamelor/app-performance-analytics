import TextField from "@mui/material/TextField";

type DateFieldProps = {
  id: string;
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

const DateField = ({ id, label, value, error, onChange }: DateFieldProps) => {
  return (
    <TextField
      id={id}
      label={label}
      type="date"
      value={value}
      size="small"
      error={Boolean(error)}
      helperText={error}
      onChange={(event) => onChange(event.target.value)}
      slotProps={{
        inputLabel: { shrink: true },
      }}
    />
  );
};

export default DateField;
