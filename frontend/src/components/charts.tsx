import { useState, useEffect } from "react";
import { useHostStore } from "./Hoststore";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function Chart() {
    const [data, setData] = useState<any[]>([]); 
    const [loading, setLoading] = useState(true);
    const selectedHost = useHostStore((state) => state.selectedHost);


    useEffect(() => {
        if (!selectedHost) return;

        fetch(`http://localhost:8000/metrics/${selectedHost}`)
            .then(response => response.json())
            .then(json => {
                const formatted_data = json.map((item: any) => ({
                    time: new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    cpu: item.cpu,
                    memory: item.memory,
                }));
                const limitedData = formatted_data.slice(-20);
                setData(limitedData);
                setLoading(false);
            })
            .catch(err => console.error("Fetch error:", err));
    }, [selectedHost]);

    if (loading) return <div className="text-white">Loading metrics...</div>;

    const chartConfig = {
        labels: data.map((item) => item.time),
        datasets: [
            {
                label: 'CPU (%)',
                data: data.map((item) => item.cpu),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                tension: 0.3, 
            },
            {
                label: 'Memory (%)',
                data: data.map((item) => item.memory),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false, 
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: 'white' } 
            },
            title: {
                display: true,
                text: 'System Resource Usage',
                color: 'white'
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                max: 100, 
                ticks: { color: 'white' }
            },
            x: {
                ticks: { color: 'white' }
            }
        }
    };

    return (
        <div className=" relative w-[clamp(300px,50vw,800px)] h-[clamp(300px,65vh,800px)] bg-[#1E293B] p-4 rounded-lg left-[-5%] ">
            <Line data={chartConfig} options={options} />
        </div>
    );
}

export default Chart;