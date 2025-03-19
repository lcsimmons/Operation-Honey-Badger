import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { Search, Filter, Download } from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;

    // Fetch log data (Replace with API call)
    useEffect(() => {
        const fetchLogs = async () => {
            const mockLogs = [
                { id: "1", timestamp: "2025-03-19T04:50:39Z", source: "mysqld", host: "ubuntu-bionic", message: "test" },
                { id: "2", timestamp: "2025-03-19T04:52:10Z", source: "firewall", host: "ubuntu-bionic", message: "test" },
                { id: "3", timestamp: "2025-03-19T04:55:22Z", source: "auth", host: "ubuntu-bionic", message: "test" },
                { id: "4", timestamp: "2025-03-19T05:01:00Z", source: "syslog", host: "ubuntu-bionic", message: "test" },
                { id: "5", timestamp: "2025-03-19T05:03:15Z", source: "nginx", host: "web-server-01", message: "test" },
                { id: "1", timestamp: "2025-03-19T04:50:39Z", source: "mysqld", host: "ubuntu-bionic", message: "test" },
                { id: "2", timestamp: "2025-03-19T04:52:10Z", source: "firewall", host: "ubuntu-bionic", message: "test" },
                { id: "3", timestamp: "2025-03-19T04:55:22Z", source: "auth", host: "ubuntu-bionic", message: "test" },
                { id: "4", timestamp: "2025-03-19T05:01:00Z", source: "syslog", host: "ubuntu-bionic", message: "test" },
                { id: "5", timestamp: "2025-03-19T05:03:15Z", source: "nginx", host: "web-server-01", message: "test" },
                { id: "1", timestamp: "2025-03-19T04:50:39Z", source: "mysqld", host: "ubuntu-bionic", message: "test" },
                { id: "2", timestamp: "2025-03-19T04:52:10Z", source: "firewall", host: "ubuntu-bionic", message: "test" },
                { id: "3", timestamp: "2025-03-19T04:55:22Z", source: "auth", host: "ubuntu-bionic", message: "test" },
                { id: "4", timestamp: "2025-03-19T05:01:00Z", source: "syslog", host: "ubuntu-bionic", message: "test" },
                { id: "5", timestamp: "2025-03-19T05:03:15Z", source: "nginx", host: "web-server-01", message: "test" },
                { id: "1", timestamp: "2025-03-19T04:50:39Z", source: "mysqld", host: "ubuntu-bionic", message: "test" },
                { id: "2", timestamp: "2025-03-19T04:52:10Z", source: "firewall", host: "ubuntu-bionic", message: "test" },
                { id: "3", timestamp: "2025-03-19T04:55:22Z", source: "auth", host: "ubuntu-bionic", message: "test" },
                { id: "4", timestamp: "2025-03-19T05:01:00Z", source: "syslog", host: "ubuntu-bionic", message: "test" },
                { id: "5", timestamp: "2025-03-19T05:03:15Z", source: "nginx", host: "web-server-01", message: "test" },
            ];
            setLogs(mockLogs);
            setFilteredLogs(mockLogs);
        };

        fetchLogs();
    }, []);

    // Process Data for Bar Chart (Grouping logs by minute)
    const logsByTimestamp = logs.reduce((acc, log) => {
        const time = new Date(log.timestamp).toISOString().substring(11, 16); // Extract HH:MM
        acc[time] = (acc[time] || 0) + 1;
        return acc;
    }, {});

    const barChartData = Object.keys(logsByTimestamp).map((key) => ({
        time: key,
        count: logsByTimestamp[key],
    }));

    // Search Functionality
    useEffect(() => {
        const filtered = logs.filter((log) =>
            Object.values(log)
                .join(" ")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
        setFilteredLogs(filtered);
        setCurrentPage(1);
    }, [searchQuery, logs]);

    // Page Logic
    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    return (
        <div className="flex bg-gradient-to-br from-[#91d2ff] to-[#72b4ea] min-h-screen">
            <Sidebar />

            <div className="flex-1 ml-20 text-black transition-all duration-300 p-6">
                {/* Search & Filter Panel */}
                <div className="bg-white/70 backdrop-blur-lg shadow-md rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center w-2/3 bg-gray-100 p-2 rounded-lg">
                        <Search size={20} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search logs..."
                            className="bg-transparent outline-none ml-2 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex space-x-4">
                        <button className="flex items-center bg-gray-200 px-3 py-2 rounded-md">
                            <Filter size={16} className="mr-2" /> Filter
                        </button>
                        <button className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-md">
                            <Download size={16} className="mr-2" /> Export Logs
                        </button>
                    </div>
                </div>

                {/* Bar Chart - Logs Per Timestamp */}
                <div className="bg-white/70 p-4 rounded-lg shadow-md mt-6">
                    <h2 className="text-lg font-bold">Log Entries Over Time</h2>
                    <ResponsiveContainer width="100%" height={150}>
                        <BarChart data={barChartData}>
                            <XAxis dataKey="time" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="count" fill="#0088FE" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Logs Table */}
                <div className="bg-white/70 p-6 rounded-lg shadow-md mt-6 overflow-auto max-h-[65vh]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border-b">Timestamp</th>
                                <th className="p-2 border-b">Source</th>
                                <th className="p-2 border-b">Host</th>
                                <th className="p-2 border-b">Message</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLogs.length > 0 ? (
                                currentLogs.map((log) => (
                                    <tr key={log.id} className="border-b hover:bg-gray-50">
                                        <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="p-2">{log.source}</td>
                                        <td className="p-2">{log.host}</td>
                                        <td className="p-2">{log.message}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="p-2 text-center">
                                        No logs found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4">
                        <button
                            className={`px-4 py-2 mx-1 rounded-md ${currentPage === 1 ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2">{`Page ${currentPage} of ${totalPages}`}</span>
                        <button
                            className={`px-4 py-2 mx-1 rounded-md ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
