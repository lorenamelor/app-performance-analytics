import Button from "@mui/material/Button";
import "./errorState.css";

type ErrorStateProps = {
  message: string;
  onRetry: () => void;
};

const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <div className="errorState" role="alert">
      <h2 className="errorState__title">Oops, something went wrong</h2>
      <p className="errorState__message">{message}</p>
      <Button
        variant="contained"
        color="primary"
        className="errorState__retry"
        onClick={onRetry}
      >
        Try again
      </Button>
    </div>
  );
};

export default ErrorState;
