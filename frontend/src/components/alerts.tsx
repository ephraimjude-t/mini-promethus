import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect } from 'react';

function Notify(){

    const [stats, setStats] = useState({ cpu: 0, memory: 0, disk: 0, load: 0 });

    useEffect(() => {

        const ws = new WebSocket('ws://localhost:8000/ws');

        ws.onopen = () => {
            console.log('WebSocket connection opened');
        };
        
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setStats({
                cpu: data.cpu,
                memory: data.memory,
                disk: data.disk,
                load: data.load
            })
        };
        
        ws.onclose = () => {
            console.log('WebSocket connection closed');
        };

    },[])

    useEffect(() => {
        const { cpu, memory, disk, load } = stats;

        const alerts = [
            { value: Number(cpu), label: 'CPU', threshold: 90, id: 'alert-cpu' },
            { value: memory, label: 'Memory', threshold: 85, id: 'alert-mem' },
            { value: disk, label: 'Disk', threshold: 95, id: 'alert-disk' },
            { value: load, label: 'Load', threshold: 2.0, id: 'alert-load' }, 
        ];

        alerts.forEach((alert) => {
            if (alert.value > alert.threshold) {
                toast.error(`Alert: ${alert.label} is at ${alert.value}${alert.label === 'Load' ? '' : '%'}`, {
                    toastId: alert.id,
                    theme: "dark",
                });
            }
        });
        
    },[stats])

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-white">
            <ToastContainer limit={4} newestOnTop stacked />
        </div>
);

}
export default Notify;