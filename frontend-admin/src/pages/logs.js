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
import { useTextSize } from '@/context/TextSizeContext';

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 10;
    const { useOpenDyslexic } = useContext(FontContext);
    const { language } = useContext(LanguageContext);
    const { textSize } = useTextSize();

    const [uiText, setUiText] = useState({
        searchLogs: "Search logs...",
        filter: "Filter",
        exportLogs: "Export Logs",
        chartTitle: "Log Entries Over Time",
        timestamp: "Timestamp",
        attacker_id: "Attacker ID",
        source: "Source",
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
    const fetchLogs = async () => {
        try {
            // Fetch logs from the API endpoint
            const response = await fetch('/api/requestlogs');
            const data = await response.json();
            
            const transformedLogs = data.message.map((log, index) => {

                return {
                    id: log.log_id || log['log-id'] || String(index + 1),
                    timestamp: log['@timestamp'] || log['current-interaction'] || new Date().toISOString(),
                    attacker_id: log['attacker-id'] || log.attacker_id,
                    source: determineSource(log),
                    //host: determineHost(log),
                    message: determineMessage(log)
                };
            });
            
            const sortedLogs = transformedLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

            setLogs(sortedLogs);
            setFilteredLogs(sortedLogs);
        } catch (error) {
            console.error('Error fetching logs:', error);
            setLogs(mockLogs);
            setFilteredLogs(mockLogs);
        }
    };
    
    const determineSource = (log) => {
        if (log.event && log.event.original) {
            try {
                const originalEvent = typeof log.event.original === 'string' 
                    ? JSON.parse(log.event.original) 
                    : log.event.original;
                
                if (originalEvent['geolocation']) {
                    try {
                        const geoData = typeof originalEvent['geolocation'] === 'string' 
                            ? JSON.parse(originalEvent['geolocation']) 
                            : originalEvent['geolocation'];
                            
                        if (geoData.ip && geoData.country) {
                            return `${geoData.ip} (${geoData.country})`;
                        }
                        else if (geoData.ip){
                            return geoData.ip;
                        }
                         else if (geoData.country) {
                            return geoData.country;
                        }
                    } catch (e) {
                    }
                }
            } catch (e) {
            }
        }
        return log.source || 'system';
    };
    
    const determineMessage = (log) => {
        if (log['gemini-response'] && log['gemini-response'].description) {
            return log['gemini-response'].description;
        }
        
        return log.message || 'No message available';
    };
    
    useEffect(() => {
        fetchLogs();
    }, []);

    // Process Data for Bar Chart (Grouping logs by minute)
    const logsByTimestamp = logs.reduce((acc, log) => {
        const time = new Date(log.timestamp).toISOString().substring(11, 16); // Extract HH:MM
        acc[time] = (acc[time] || 0) + 1;
        return acc;
    }, {});

    
    const adjustTimeForDisplay = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    
    let adjustedHours = hours - 5;
    if (adjustedHours < 0) {
        adjustedHours += 24;
    }
    
    return `${String(adjustedHours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

    const barChartData = Object.keys(logsByTimestamp)
    .sort((a, b) => {
    // Convert HH:MM back to minutes for comparison
    const [ah, am] = a.split(":").map(Number);
    const [bh, bm] = b.split(":").map(Number);
    return (ah * 60 + am) - (bh * 60 + bm);
    })
    .map((key) => ({
    time: adjustTimeForDisplay(key),
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
        className={`flex bg-gradient-to-br from-[#91d2ff] to-[#72b4ea] min-h-screen ${textSize}`}>
            <title>Logs Search</title>
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
                            <XAxis dataKey="time"/>
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
                                <th className="p-2 border-b">{uiText.attacker_id}</th>
                                <th className="p-2 border-b">{uiText.source}</th>
                                <th className="p-2 border-b">{uiText.message}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentLogs.length > 0 ? (
                                currentLogs.map((log) => (
                                    <tr key={log.id} className="border-b hover:bg-gray-50/40">
                                        <td className="p-2">{new Date(log.timestamp).toLocaleString()}</td>
                                        <td className="p-2">{log.attacker_id}</td>
                                        <td className="p-2">{log.source}</td>
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