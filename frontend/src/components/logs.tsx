import { useState, useEffect } from "react";
import { useHostStore } from "./Hoststore";

function Logs_dashboard(){

    const [logs, setLogs] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);
    const selectedHost = useHostStore((state) => state.selectedHost);

    useEffect(() => {
        if (!selectedHost) return;

        fetch(`http://localhost:8000/logs/${selectedHost}`)
            .then(response => response.json())
            .then(json => {
                setLogs(json);
                setLoading(false);
            })
            .catch(err => console.error("Fetch error:", err));
    }, [selectedHost]);

    return(
        <>
            <div className="bg-[#0D1117] rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
                <div className="bg-[#161B22] px-4 py-2 flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-xs text-gray-500 ml-2 font-mono">stack.sh</span>
                </div>
                <div className="p-6 font-mono text-green-400">
                    <p><span className="text-blue-400">➜</span> <span className="text-white">LOGS:
                    </span>
                        {loading ? (
                            <span>Loading logs...</span>
                        ) : (
                            <ul>
                                {logs.map((log) => (
                                    <li key={log.time} className="flex gap-3">
                                        <span className="text-white opacity-70">[{log.time}]</span>
                                        <span className="text-green-400">{log.message}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </p>
                </div>
            </div>

        </>
    )

  

}
export default Logs_dashboard;