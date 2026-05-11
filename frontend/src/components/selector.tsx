import { useState, useEffect } from "react";
import { useHostStore } from "./Hoststore"; 

function HostSelector() {
    const [Data, setData] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>('');

    // --- ZUSTAND HOOKS ---
    // Connect to the global state instead of local useState
    const selectedHost = useHostStore((state) => state.selectedHost);
    const setHost = useHostStore((state) => state.setHost);

    useEffect(() => {
        fetch('http://localhost:8000/hosts')
            .then(response => response.json())
            .then(json => {
                setData(json);
            })
            .catch(err => console.error("Fetch error:", err));
    }, []);

    const filteredHosts = Data.filter((item) =>
        item.host.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-row gap-10 p-5 justify-centers">
            <div className="text-white">
                <div className="flex flex-col items-center justify-center">
                    <div className="w-64">
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Available Hosts
                        </label>
                        <select
                            value={selectedHost}
                            onChange={(e) => setHost(e.target.value)} // Updates Zustand
                            className="w-full px-4 py-2 border border-[#4b5563] bg-[#121212] rounded-md text-white outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="" disabled>-- Choose a host --</option>
                            {Data.map((item, index) => (
                                <option key={index} value={item.host}>
                                    {item.host}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="text-white">
                <div className="flex flex-col justify-center">
                    <div className="w-80 relative"> 
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            Search & Select
                        </label>
                        <input 
                            type="text"
                            placeholder="Type to find..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 bg-[#121212] border border-[#4b5563] rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-white"
                        />

                        {searchTerm.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-[#121212] border border-[#4b5563] rounded-md shadow-2xl max-h-60 overflow-y-auto">
                                {filteredHosts.length > 0 ? (
                                    filteredHosts.map((item, index) => (
                                        <div 
                                            key={index} 
                                            onClick={() => {
                                                setHost(item.host);
                                                setSearchTerm(""); 
                                            }}
                                            className="px-4 py-2 cursor-pointer hover:bg-blue-600 transition-colors"
                                        >
                                            {item.host}
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-2 text-gray-500 italic text-sm">No matches found</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HostSelector;