import Button from "@mui/material/Button";
import "./errorState.css";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div className="errorState" role="alert">
      <p className="errorState__message">{message}</p>
      <Button variant="outlined" onClick={onRetry}>
        Try again
      </Button>
    </div>
  );
};

export default ErrorState;
