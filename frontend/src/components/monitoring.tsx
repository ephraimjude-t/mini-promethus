import { useEffect, useState } from "react";
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { NumericFormat } from 'react-number-format';
import { useHostStore } from "./Hoststore";

function Monitoring(){
    const [cpu, setCpu] = useState(0);
    const [memory, setMemory] = useState(0);
    const [disk, setDisk] = useState(0);
    const [load, setLoad] = useState(0);
    const selectedHost = useHostStore((state) => state.selectedHost);

    useEffect(() =>{

        if (!selectedHost) return;

        const ws = new WebSocket(`ws://localhost:8000/ws/metrics/${selectedHost}`);

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setCpu(data.cpu);
            setMemory(data.memory);
            setDisk(data.disk);
            setLoad(data.load);
        };
        
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };


    },[selectedHost])

    return(
        <>
            <div className="p-20 w-[clamp(300px,50vw,600px)]">
                <div className="flex flex-col bg-[#1E293B] p-10 rounded-xl">
                    <div className="flex flex-row gap-10 justify-center text-[#F8FAFC]">
                            <div className="h-40 w-40 ">
                                <CircularProgressbarWithChildren
                                    value={cpu}
                                    circleRatio={0.5}
                                    styles={buildStyles({
                                        rotation: 0.75,
                                        strokeLinecap: 'round',
                                        pathColor: cpu > 90 ? '#EF4444' : cpu > 70 ? '#F59E0B' : '#2DD4BF',
                                        trailColor: '#e5e7eb',
                                    })}
                                >
                                    <div className="mt-[-40px] text-xl font-bold">{cpu}%</div>
                                    <p>
                                        cpu
                                    </p>

                                </CircularProgressbarWithChildren>
                            </div>
                            <div className="h-40 w-40">
                                <CircularProgressbarWithChildren
                                    value={memory}
                                    circleRatio={0.5}
                                    styles={buildStyles({
                                        rotation: 0.75,
                                        strokeLinecap: 'round',
                                        pathColor: memory > 90 ? '#EF4444' : memory > 70 ? '#F59E0B' : '#2DD4BF',
                                        trailColor: '#e5e7eb',
                                    })}
                                >
                                    <div className="mt-[-40px] text-xl font-bold">{memory}%</div>
                                    <p>
                                        memory
                                    </p>


                                </CircularProgressbarWithChildren>  
                            </div>
                    </div>
                    <div className="flex flex-row gap-10 text-[#F8FAFC] justify-center">
                        <div className="h-40 w-40">
                            <CircularProgressbarWithChildren
                                value={disk}
                                circleRatio={0.5}
                                styles={buildStyles({
                                    rotation: 0.75,
                                    strokeLinecap: 'round',
                                    pathColor: disk > 90 ? '#EF4444' : disk > 70 ? '#F59E0B' : '#2DD4BF',
                                    trailColor: '#e5e7eb',
                                })}
                            >
                                <div className="mt-[-40px] text-xl font-bold">{disk}%</div>
                                <p>
                                    disk
                                </p>

                            </CircularProgressbarWithChildren>
                        </div>
                        <div className=" h-40 w-40">
                            <CircularProgressbarWithChildren
                                value={load}
                                circleRatio={0.5}
                                styles={buildStyles({
                                    rotation: 0.75,
                                    strokeLinecap: 'round',
                                    pathColor: load > 90 ? '#EF4444' : load > 70 ? '#F59E0B' : '#2DD4BF',
                                    trailColor: '#e5e7eb',
                                })}
                            >
                                <div className="mt-[-40px] text-xl font-bold">
                                    <NumericFormat value={load} displayType={'text'} suffix="%" thousandSeparator={true} decimalScale={2} fixedDecimalScale={true} />
                                </div>
                                <p>
                                    load
                                </p>

                            </CircularProgressbarWithChildren>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
    

}
export default Monitoring;