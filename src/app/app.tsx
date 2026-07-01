import Chart from "../components/chart/chart";
import Table from "../components/table/table";
import useData from "../hooks/useData";
import "./App.css";

const App = () => {
  const data = useData();

  return (
    <div className="container">
      <div>
        <p>
          Start Date: <input value="2020-01-01" />
        </p>
        <p>
          End Date: <input value="2020-01-07" />
        </p>
      </div>
      <Chart data={data} />
      <Table data={data} />
    </div>
  );
};

export default App;
