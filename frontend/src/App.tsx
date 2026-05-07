import Monitoring from "./components/monitoring";
import Chart from "./components/charts";
import Alerts from "./components/alerts";
import HostSelector from "./components/selector";

function App(){

  return(
    <>
      <div className="bg-[#0F172A] w-full min-h-screen flex flex-col ">
        <div>
          <HostSelector />
        </div>
        <div className="flex flex-row ">
          <div>
            <Monitoring />
          </div>
          <div>
            <Alerts />
          </div>
          <div className="py-20">
            <Chart />
          </div>
        </div>
      </div>
    </>
  )

}
export default App;