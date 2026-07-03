import CircularProgress from "@mui/material/CircularProgress";
import "./loading.css";

const Loading = () => {
  return (
    <div className="chart loading" role="status" aria-label="Loading chart">
      <CircularProgress />
    </div>
  );
};

export default Loading;
