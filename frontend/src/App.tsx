import Monitoring from "./components/monitoring";
import Chart from "./components/charts";
import Notify from "./components/alerts.tsx";
import HostSelector from "./components/selector";
import Logs_dashboard from './components/logs.tsx'

function App(){

  return(
    <>
      <Notify />
      <div className="bg-[#0A0A0A] w-full min-h-screen flex flex-col items-center ">
        <div>
          <HostSelector />
        </div>
        <div className="flex flex-col items-center justify-center ">
          <div>
            <Monitoring />
          </div>
          <div>
            <Chart />
          </div>
        </div>
        <div className="p-20">
          <Logs_dashboard />
        </div>
      </div>
    </>
  )

}
export default App;