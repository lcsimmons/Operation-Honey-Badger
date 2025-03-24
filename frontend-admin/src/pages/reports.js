import { useState, useEffect } from "react";
import Sidebar from "../components/sidebar";
import { Search, HelpCircle } from "lucide-react";

export default function Reports() {
    // Define all state variables at the top of the component
    // Static UI text that needs translation - define this first
    const [uiText, setUiText] = useState({
        recentReports: "Recent Reports",
        reportDetails: "Report Details",
        exportReport: "Export Report (PDF, CSV)",
        noReportsFound: "No reports found.",
        incidentId: "Incident ID",
        time: "Time",
        severity: "Severity",
        status: "Status",
        high: "HIGH",
        medium: "Medium",
        low: "Low",
        inProgress: "In Progress",
        completed: "Completed",
        sqlInjection: "SQL Injection",
        searchReports: "Search reports...",
        translating: "Translating..."
    });
    
    const [reportHTML, setReportHTML] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentLanguage, setCurrentLanguage] = useState("en");
    const [isTranslating, setIsTranslating] = useState(false);
    const [originalReportHTML, setOriginalReportHTML] = useState("");
    const [translations, setTranslations] = useState({});

    // Placeholder Reports Data with original English values
    const originalReports = [
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

    // Create a state for the translated reports
    const [reports, setReports] = useState(originalReports);
    const [filteredReports, setFilteredReports] = useState(originalReports);

    // Initialize with default language from localStorage
    useEffect(() => {
        const savedLanguage = localStorage.getItem('reportLanguage');
        if (savedLanguage) {
            setCurrentLanguage(savedLanguage);
        }
    }, []);

    // Translate UI text whenever language changes
    useEffect(() => {
        if (currentLanguage !== 'en') {
            translateUIText();
        } else {
            // Reset to English
            setUiText({
                recentReports: "Recent Reports",
                reportDetails: "Report Details",
                exportReport: "Export Report (PDF, CSV)",
                noReportsFound: "No reports found.",
                incidentId: "Incident ID",
                time: "Time",
                severity: "Severity",
                status: "Status",
                high: "HIGH",
                medium: "Medium",
                low: "Low",
                inProgress: "In Progress",
                completed: "Completed",
                sqlInjection: "SQL Injection",
                searchReports: "Search reports...",
                translating: "Translating..."
            });
            
            // Reset reports to original English values
            setReports([...originalReports]);
            setFilteredReports([...originalReports]);
        }
    }, [currentLanguage]);

    // Function to translate static UI text
    const translateUIText = async () => {
        try {
            const textsToTranslate = Object.values(uiText);
            
            // Add the severity and status values to translate
            textsToTranslate.push("High", "Medium", "In Progress", "Completed");
            
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: textsToTranslate,
                    targetLanguage: currentLanguage
                })
            });
            
            const data = await response.json();
            
            if (data.translations) {
                const keys = Object.keys(uiText);
                const translatedUiText = { ...uiText };
                
                // Map translated texts back to their keys (for UI text)
                for (let i = 0; i < keys.length; i++) {
                    translatedUiText[keys[i]] = data.translations[i].translatedText;
                }
                
                setUiText(translatedUiText);
                
                // Build translation map for all texts
                const translationMap = {};
                textsToTranslate.forEach((text, index) => {
                    translationMap[text] = data.translations[index].translatedText;
                });
                
                setTranslations(translationMap);
                
                // Translate report severity and status values
                const translatedReports = originalReports.map(report => {
                    const translatedReport = { ...report };
                    
                    // Translate severity
                    if (translationMap[report.severity]) {
                        translatedReport.severity = translationMap[report.severity];
                    }
                    
                    // Translate status
                    if (translationMap[report.status]) {
                        translatedReport.status = translationMap[report.status];
                    }
                    
                    return translatedReport;
                });
                
                setReports(translatedReports);
                
                // Update filtered reports as well
                const filtered = translatedReports.filter((report) =>
                    Object.values(report)
                        .join(" ")
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                );
                setFilteredReports(filtered);
            }
        } catch (error) {
            console.error('Error translating UI text:', error);
        }
    };

    // Initialize report content with first report
    useEffect(() => {
        const initialReportHTML = `
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
        `;
        
        setOriginalReportHTML(initialReportHTML);
        setReportHTML(initialReportHTML);

        // If a non-English language is selected, translate the initial report
        if (currentLanguage !== 'en') {
            translateReport(initialReportHTML, currentLanguage);
        }
    }, [currentLanguage, reports]);

    // Translate report content when language changes
    useEffect(() => {
        if (originalReportHTML && currentLanguage !== 'en') {
            translateReport(originalReportHTML, currentLanguage);
        } else if (originalReportHTML) {
            setReportHTML(originalReportHTML);
        }
    }, [currentLanguage, originalReportHTML]);

    // Search Functionality
    useEffect(() => {
        const filtered = reports.filter((report) =>
            Object.values(report)
                .join(" ")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
        setFilteredReports(filtered);
    }, [searchQuery, reports]);

    // Function to call Google Translate API
    const translateReport = async (htmlContent, targetLanguage) => {
        if (targetLanguage === 'en') {
            // If English is selected, revert to original content
            setReportHTML(originalReportHTML);
            setIsTranslating(false);
            return;
        }

        setIsTranslating(true);

        try {
            // Extract text from HTML while preserving the structure
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlContent, 'text/html');
            
            // Find elements to translate
            const elements = {
                title: doc.querySelector('h2'),
                paragraphs: Array.from(doc.querySelectorAll('p')),
                listItems: Array.from(doc.querySelectorAll('li')),
                labels: Array.from(doc.querySelectorAll('b')),
            };
            
            // Prepare arrays of text to translate
            const textsToTranslate = [];
            const elementMap = [];
            
            // Helper function to extract text content for translation
            const extractTextForTranslation = (element) => {
                if (!element) return;
                
                // Don't translate numerical values and ids
                if (element.textContent.trim().match(/^\d+(\.\d+)?$/) || 
                    element.textContent.includes('ID:') || 
                    element.textContent.match(/^\d+\/\d+\/\d+/)) {
                    return;
                }
                
                textsToTranslate.push(element.textContent.trim());
                elementMap.push(element);
            };
            
            // Extract text from each element type
            if (elements.title) extractTextForTranslation(elements.title);
            
            elements.paragraphs.forEach(p => {
                // Skip paragraphs with just timestamps or IDs
                if (!p.textContent.match(/^\d+\/\d+\/\d+ \d+:\d+[AP]M$/) && 
                    !p.textContent.match(/^Incident ID: \d+$/)) {
                    extractTextForTranslation(p);
                }
            });
            
            elements.listItems.forEach(li => extractTextForTranslation(li));
            elements.labels.forEach(label => extractTextForTranslation(label));
            
            // Only proceed if we have text to translate
            if (textsToTranslate.length === 0) {
                setReportHTML(htmlContent);
                setIsTranslating(false);
                return;
            }
            
            // Make API call to our server-side translation endpoint
            const response = await fetch('/api/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: textsToTranslate,
                    targetLanguage: targetLanguage
                })
            });
            
            const data = await response.json();
            
            if (data.translations) {
                // Replace original text with translations
                data.translations.forEach((translation, index) => {
                    const element = elementMap[index];
                    if (element) {
                        element.textContent = translation.translatedText;
                    }
                });
                
                // Create new HTML with translations
                setReportHTML(doc.body.innerHTML);
            } else {
                // If translation failed, use original content
                console.error('Translation failed:', data.error);
                setReportHTML(originalReportHTML);
            }
        } catch (error) {
            console.error('Translation error:', error);
            // Fallback to original content on error
            setReportHTML(originalReportHTML);
        } finally {
            setIsTranslating(false);
        }
    };

    // Function to handle selecting a report
    const selectReport = (report) => {
        const newReportHTML = `
            <div>
                <h2>${report.title}</h2>
                <p><b>Incident ID:</b> ${report.id}</p>
                <p><b>Time:</b> ${report.time}</p>
                <p><b>Severity:</b> <span style="color: ${report.severity === "High" || report.severity === uiText.high ? "red" : "orange"}; font-weight: bold;">${report.severity}</span></p>
                <p><b>Status:</b> ${report.status}</p>
                <br>
                <b>Analyst Notes</b>
                <p>${report.notes}</p>
                <br>
                <b>Recommended Actions</b>
                <ul>${report.actions.map((action) => `<li>${action}</li>`).join("")}</ul>
            </div>
        `;
        
        setOriginalReportHTML(newReportHTML);
        
        // If a non-English language is selected, translate the report
        if (currentLanguage !== 'en') {
            translateReport(newReportHTML, currentLanguage);
        } else {
            setReportHTML(newReportHTML);
        }
    };

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
                            placeholder={uiText?.searchReports || "Search reports..."}
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
                        <h2 className="text-lg font-bold">{uiText?.recentReports || "Recent Reports"}</h2>

                        {filteredReports.length > 0 ? (
                            filteredReports.map((report) => (
                                <div
                                    key={report.id}
                                    className="cursor-pointer bg-gray-100 p-3 rounded-md my-2 hover:bg-gray-200 transition-all"
                                    onClick={() => selectReport(report)}
                                >
                                    <h3 className="font-semibold">{report.title}</h3>
                                    <p className="text-sm">{uiText?.incidentId || "Incident ID"}: {report.id}</p>
                                    <p className="text-sm">{uiText?.time || "Time"}: {report.time}</p>
                                    <p className={`text-sm font-bold ${
                                        report.severity === "High" || 
                                        report.severity === uiText.high ? 
                                        "text-red-600" : "text-orange-500"}`}
                                    >
                                        {uiText?.severity || "Severity"}: {report.severity}
                                    </p>
                                    <p className="text-sm">{uiText?.status || "Status"}: {report.status}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 mt-2">{uiText?.noReportsFound || "No reports found."}</p>
                        )}
                    </div>

                    {/* Report Details Panel */}
                    <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg font-bold">{uiText?.reportDetails || "Report Details"}</h2>
                            <div className="flex gap-2">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm">
                                    {uiText?.exportReport || "Export Report (PDF, CSV)"}
                                </button>
                                <span className="bg-green-500 text-white px-3 py-1 rounded-md text-sm">
                                    {uiText?.sqlInjection || "SQL Injection"}
                                </span>
                                <span className="bg-red-500 text-white px-3 py-1 rounded-md text-sm">
                                    {uiText?.high || "HIGH"}
                                </span>
                            </div>
                        </div>

                        {/* Translation Loading Indicator */}
                        {isTranslating && (
                            <div className="mt-2 text-sm text-blue-600 flex items-center">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                {uiText?.translating || "Translating..."}
                            </div>
                        )}

                        {/* Injecting Selected Report HTML */}
                        <div className="mt-4 p-4 border rounded-md text-sm" dangerouslySetInnerHTML={{ __html: reportHTML }} />
                    </div>
                </div>
            </div>
        </div>
    );
}