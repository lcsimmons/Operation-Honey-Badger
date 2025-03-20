import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { Search, HelpCircle } from "lucide-react";

export default function Reports() {
    const [reportHTML, setReportHTML] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    // Placeholder Reports Data
    const reports = [
        {
            id: "2444",
            title: "Incident Report 3.23.25.1345",
            time: "3/23/25 1:45PM",
            severity: "High",
            status: "In Progress",
            notes: "Reference additional SIEM tools to gather evidence & build logic trail.",
            actions: ["Investigate further logs", "Escalate to senior analysts"]
        },
        {
            id: "2445",
            title: "Incident Report 3.23.25.1346",
            time: "3/23/25 2:30PM",
            severity: "Medium",
            status: "Completed",
            notes: "Reviewed attack patterns and verified false positive.",
            actions: ["Report archived, no further action needed.", "Continue monitoring for similar activity."]
        },
    ];

    const [filteredReports, setFilteredReports] = useState(reports);

    useEffect(() => {
        setReportHTML(`
            <div>
                <h2>${reports[0].title}</h2>
                <p><b>Incident ID:</b> ${reports[0].id}</p>
                <p><b>Time:</b> ${reports[0].time}</p>
                <p><b>Severity:</b> <span style="color: red; font-weight: bold;">${reports[0].severity}</span></p>
                <p><b>Status:</b> ${reports[0].status}</p>
                <br>
                <b>Analyst Notes</b>
                <p>${reports[0].notes}</p>
                <br>
                <b>Recommended Actions</b>
                <ul>${reports[0].actions.map((action) => `<li>${action}</li>`).join("")}</ul>
            </div>
        `);
    }, []);

    // Search Functionality
    useEffect(() => {
        const filtered = reports.filter((report) =>
            Object.values(report)
                .join(" ")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
        setFilteredReports(filtered);
    }, [searchQuery]);

    return (
        <div className="flex bg-gradient-to-br from-[#91d2ff] to-[#72b4ea] min-h-screen">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1 ml-20 text-black transition-all duration-300 p-6">
                {/* Search Bar */}

                <div className="bg-white/70 backdrop-blur-lg shadow-md rounded-lg p-4 flex items-center justify-between">
                    <div className="max-w-[800px] flex items-center w-2/3 bg-gray-100 p-2 rounded-lg">
                        <Search size={20} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search reports..."
                            className="bg-transparent outline-none ml-2 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <HelpCircle size={24} className="cursor-pointer text-gray-500 hover:text-black" />
                </div>

                {/* Reports Section */}
                <div className="grid grid-cols-3 gap-6 p-6">
                    {/* Reports List */}
                    <div className="bg-white p-4 rounded-lg shadow-md col-span-1 max-h-[75vh] overflow-y-auto">
                        <h2 className="text-lg font-bold">Recent Reports</h2>

                        {filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                                <div
                                    key={report.id}
                                    className="cursor-pointer bg-gray-100 p-3 rounded-md my-2 hover:bg-gray-200 transition-all"
                                    onClick={() =>
                                        setReportHTML(`
                                        <div>
                                            <h2>${report.title}</h2>
                                            <p><b>Incident ID:</b> ${report.id}</p>
                                            <p><b>Time:</b> ${report.time}</p>
                                            <p><b>Severity:</b> <span style="color: ${report.severity === "High" ? "red" : "orange"}; font-weight: bold;">${report.severity}</span></p>
                                            <p><b>Status:</b> ${report.status}</p>
                                            <br>
                                            <b>Analyst Notes</b>
                                            <p>${report.notes}</p>
                                            <br>
                                            <b>Recommended Actions</b>
                                            <ul>${report.actions.map((action) => `<li>${action}</li>`).join("")}</ul>
                                        </div>
                                    `)
                                    }
                                >
                                    <h3 className="font-semibold">{report.title}</h3>
                                    <p className="text-sm">Incident ID: {report.id}</p>
                                    <p className="text-sm">Time: {report.time}</p>
                                    <p className={`text-sm font-bold ${report.severity === "High" ? "text-red-600" : "text-orange-500"}`}>
                                        Severity: {report.severity}
                                    </p>
                                    <p className="text-sm">Status: {report.status}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 mt-2">No reports found.</p>
                        )}
                    </div>

                    {/* Report Details Panel */}
                    <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold">Report Details</h2>
                            <div className="flex gap-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">Export Report (PDF, CSV)</button>
                                <span className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">SQL Injection</span>
                                <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">HIGH</span>
                            </div>
                        </div>

                        {/* Injecting Selected Report HTML */}
                        <div className="mt-4 p-4 border rounded-md text-sm" dangerouslySetInnerHTML={{ __html: reportHTML }} />
                    </div>
                </div>
            </div>
        </div>
    );
}
