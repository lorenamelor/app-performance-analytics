import Chart from "../components/chart/chart";
import Table from "../components/table/table";
import useData from "../hooks/useData";
import { getDefaultEndDate, getDefaultStartDate } from "./defaults";
import "./app.css";

const App = () => {
  const { data } = useData();

  return (
    <div className="container">
      <div>
        <p>
          Start Date: <input value={getDefaultStartDate()} />
        </p>
        <p>
          End Date: <input value={getDefaultEndDate()} />
        </p>
      </div>
      <Chart data={data} />
      <Table data={data} />
    </div>
  );
};

export default App;
