import "./App.css";
import { Calendar } from "./components/Calendar";

const App = () => {
  return (
    <>
      <div className="container">
        <h1 className="text-3xl text-blue-400 font-bold ">
          Interview Scheduler
        </h1>
        <Calendar />
      </div>
    </>
  );
};

export default App;
