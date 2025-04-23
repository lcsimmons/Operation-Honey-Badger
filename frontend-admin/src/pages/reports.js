import { useState, useEffect, useRef } from "react";
import { useContext } from 'react'; import { FontContext } from '../context/FontContext';
import Sidebar from "../components/sidebar";
import { Search, HelpCircle, Flame, ShieldAlert, BugPlay } from "lucide-react";
import { useRouter } from 'next/router';

export default function Reports() {
    // Define all state variables at the top of the component
    // Static UI text that needs translation - define this first
    const [uiText, setUiText] = useState({
        recentReports: "Recent Reports",
        reportDetails: "Report Details",
        exportReport: "Export Report (PDF, CSV)",
        noReportsFound: "No reports found.",
        reportId: "Report ID",
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
        translating: "Translating...",
        ttsEnabled: "Text-to-speech enabled. Hover over text to hear it.",
        stop: "Stop"
    });

    const [reportHTML, setReportHTML] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentLanguage, setCurrentLanguage] = useState("en");
    const [isTranslating, setIsTranslating] = useState(false);
    const [originalReportHTML, setOriginalReportHTML] = useState("");
    const [translations, setTranslations] = useState({});
    // Add text-to-speech state with default value
    const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
    // Reference to the audio element for TTS
    const audioRef = useRef(null);
    // Track if we're currently speaking
    const [isSpeaking, setIsSpeaking] = useState(false);
    // Store the last text that was spoken to avoid repeating
    const lastSpokenTextRef = useRef("");
    // Add timeout reference to handle hover delays
    const hoverTimeoutRef = useRef(null);
    // Keeps track of the selected text size, by default it's text-base
    const [textSize, setTextSize] = useState("text-base");

    const { useOpenDyslexic } = useContext(FontContext);
	
	const [reports, setReports] = useState([]);
	const [filteredReports, setFilteredReports] = useState([]);
	const [attackerIdInput, setAttackerIdInput] = useState("");
	const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

	// Fetching reports for Reports Page
	const fetchReportsFromBackend = async () => {
	  try {
		const res = await fetch('/api/reports');
		// const res = await fetch('http://localhost:5000/api/reports'); // set for local testing
		const data = await res.json();

		if (data.reports && Array.isArray(data.reports)) {
		  const backendFormatted = data.reports.map(report => ({
			id: report.report_id,
			title: `Attacker Profile: Attacker ${report.attacker_id}`,
			time: report.created_at
			  ? new Date(report.created_at).toLocaleString('en-US', {
				  month: 'short', // change from numeric
				  day: '2-digit', // change from numeric
				  year: 'numeric', // change from 2-digit
				  hour: '2-digit', // change from numeric
				  minute: '2-digit', // change from numeric
				  hour12: false // 24 hour clock
				}) : "23:59",
			severity: report.severity === 1 ? "High" : report.severity === 2 ? "Medium" : "Low",
			status: "Summary Generated",
			notes: report.summary || "No summary provided.",
			actions: ["Review Gemini analysis", "Correlate with other sessions"]
		  }));

		  setReports(backendFormatted);
		  setFilteredReports(backendFormatted);
		}
	  } catch (err) {
		console.error('Error fetching stored reports:', err);
	  }
	};


	useEffect(() => {
	  fetchReportsFromBackend();
	}, []);

    // Initialize with default language and TTS setting from localStorage and handle cleanup
    useEffect(() => {
        // Initialize window.currentTTSController if it doesn't exist
        if (typeof window !== 'undefined' && window.currentTTSController === undefined) {
            window.currentTTSController = null;
        }

        // Load language setting
        const savedLanguage = localStorage.getItem('reportLanguage');
        if (savedLanguage) {
            setCurrentLanguage(savedLanguage);
        }

        // Load text-to-speech setting - explicitly parse as boolean
        const savedTTS = localStorage.getItem('textToSpeechEnabled');
        const ttsEnabled = savedTTS === 'true';

        // Force to a boolean value to avoid any string/boolean confusion
        setTextToSpeechEnabled(Boolean(ttsEnabled));

        console.log('Reports page loaded TTS setting:', savedTTS, 'Parsed as:', ttsEnabled);

        // Create audio element for TTS if it doesn't exist
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.onended = () => {
                setIsSpeaking(false);
            };
        }

        // Cleanup function - runs when component unmounts
        return () => {
            console.log('Reports component unmounting - TTS cleanup performed');

            // Clear any pending timeouts
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }

            // Cancel any ongoing API request
            if (window.currentTTSController) {
                console.log('Aborting ongoing TTS API request during unmount');
                window.currentTTSController.abort();
                window.currentTTSController = null;
            }

            // Stop any playing audio
            if (audioRef.current) {
                console.log('Stopping TTS audio playback during unmount');
                audioRef.current.pause();
                audioRef.current.currentTime = 0;

                // Clear the audio source to ensure complete stop
                if (audioRef.current.src) {
                    URL.revokeObjectURL(audioRef.current.src);
                    audioRef.current.src = '';
                }
            }

            // Reset speaking state and last spoken text
            setIsSpeaking(false);
            if (lastSpokenTextRef.current) {
                lastSpokenTextRef.current = "";
            }
        };
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
                noReportsFound: "No reports found.",
                reportId: "Report ID",
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
                translating: "Translating...",
                ttsEnabled: "Text-to-speech enabled. Hover over text to hear it.",
                stop: "Stop"
            });

            // Repopulate dynamic reports
			fetchReportsFromBackend();
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
		if (!reports || reports.length === 0) return; // Guard clause

		const initialReportHTML = `
			<div>
				<h2><b>${reports[0].title}</b></h2>
				<p><b>Report ID:</b> ${reports[0].id}</p>
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
                    !p.textContent.match(/^Report ID: \d+$/)) {
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
                <p><b>Report ID:</b> ${report.id}</p>
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

    // Improved Text-to-Speech functionality - Using Google TTS API exclusively
    const speakText = async (text) => {
        // Don't speak if TTS is disabled or text is empty
        if (!textToSpeechEnabled || !text || text.trim() === '') return;

        // Don't repeat the same text
        if (text.trim() === lastSpokenTextRef.current) return;

        // Stop any ongoing speech
        stopSpeaking();

        // Update the last spoken text
        lastSpokenTextRef.current = text.trim();

        // Show that we're speaking
        setIsSpeaking(true);

        try {
            // Map language codes to Google TTS language codes
            const languageMap = {
                'en': 'en-US',
                'es': 'es-ES',
                'fr': 'fr-FR',
                'de': 'de-DE',
                'ja': 'ja-JP',
                'zh': 'zh-CN',
                'ar': 'ar-XA',
                'ru': 'ru-RU',
                'pt': 'pt-BR',
                'ko': 'ko-KR',
                'vi': 'vi-VN'
            };

            const languageCode = languageMap[currentLanguage] || 'en-US';

            console.log(`Speaking text: "${text}" in language: ${languageCode}`);

            // Create an AbortController to handle cancellation
            const controller = new AbortController();

            // Store the controller in a ref so we can access it during cleanup
            window.currentTTSController = controller;

            // Always use the Google TTS API, never use browser TTS
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: text,
                    languageCode: languageCode
                }),
                signal: controller.signal
            });

            if (!response.ok) {
                throw new Error(`API returned ${response.status}`);
            }

            // Get the audio blob
            const audioBlob = await response.blob();

            // Set the audio source
            const audioUrl = URL.createObjectURL(audioBlob);
            audioRef.current.src = audioUrl;

            // Play the audio
            await audioRef.current.play();

            // Clean up URL object when done
            audioRef.current.onended = () => {
                URL.revokeObjectURL(audioUrl);
                setIsSpeaking(false);
                window.currentTTSController = null;
            };

        } catch (error) {
            // Check if this is an abort error (which we expect during navigation)
            if (error.name === 'AbortError') {
                console.log('TTS request was aborted (expected during navigation)');
            } else {
                console.error('Text-to-speech error:', error);
            }
            setIsSpeaking(false);
            window.currentTTSController = null;
        }
    };

    // Stop speaking
    const stopSpeaking = () => {
        // Cancel any ongoing API request
        if (window.currentTTSController) {
            console.log('Aborting ongoing TTS API request');
            window.currentTTSController.abort();
            window.currentTTSController = null;
        }

        // Stop audio element if playing
        if (audioRef.current) {
            console.log('Stopping TTS audio playback');
            audioRef.current.pause();
            audioRef.current.currentTime = 0;

            // Clear the audio source to ensure complete stop
            if (audioRef.current.src) {
                URL.revokeObjectURL(audioRef.current.src);
                audioRef.current.src = '';
            }
        }

        // Reset speaking state
        setIsSpeaking(false);
        lastSpokenTextRef.current = "";
    };

    // Enhanced function to handle element hover for text-to-speech with debouncing
    const handleElementHover = (e) => {
        // Clear any existing timeout
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }

        // Only proceed if text-to-speech is enabled
        if (!textToSpeechEnabled) return;

        // Get the element that was hovered
        const target = e.target;

        // Skip reading the TTS status indicator
        if (target.closest('.tts-status-indicator')) {
            return;
        }

        // Set a short delay before speaking to avoid rapid firing
        hoverTimeoutRef.current = setTimeout(() => {
            // Get the text content
            let text = target.textContent || target.innerText;

            // Special handling for UI elements
            if (target.classList.contains('bg-blue-500') ||
                target.classList.contains('bg-green-500') ||
                target.classList.contains('bg-red-500')) {
                // This is likely a button or badge, prioritize speaking its text
                text = target.textContent.trim();
            }

            // For headers and labels, remove any nested content and just get the text
            if (['H1', 'H2', 'H3', 'LABEL'].includes(target.tagName)) {
                // Get the direct text node content
                const textNodes = Array.from(target.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE)
                    .map(node => node.textContent.trim())
                    .join(' ');

                if (textNodes) {
                    text = textNodes;
                }
            }

            // Skip if it's just an ID, date, or empty text
            if (!text ||
                text.trim() === '' ||
                text.match(/^\d+$/) ||
                text.match(/^\d+\/\d+\/\d+/)) {
                return;
            }

            // Only speak if there's meaningful text content
            if (text && text.trim() && text.trim().length > 1) {
                console.log(`Attempting to speak: "${text.trim()}" from element:`, target.tagName);
                speakText(text.trim());
            }
        }, 200); // 200ms delay for quicker response
    };

    // Function to handle mouse leave to clear timeout
    const handleMouseLeave = () => {
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
    };

    // Add event listeners for text-to-speech when component mounts or settings change
    useEffect(() => {
        // No need to set up listeners if TTS is disabled
        if (!textToSpeechEnabled) {
            return;
        }

        console.log('Setting up TTS hover listeners, enabled:', textToSpeechEnabled);

        // Function to handle hovering over any text element
        const handleTextHover = (e) => {
            // Get the element that was hovered
            const target = e.target;

            // Skip TTS status indicator elements
            if (target.closest('.tts-status-indicator')) {
                return;
            }

            // Check if we should handle this element
            if (!['H1', 'H2', 'H3', 'P', 'SPAN', 'BUTTON', 'LI', 'B', 'DIV', 'LABEL'].includes(target.tagName)) {
                return;
            }

            // If it's a div, only process if it has a specific class or role
            if (target.tagName === 'DIV' && !target.textContent.trim()) {
                return;
            }

            handleElementHover(e);
        };

        // Add event listeners to the entire document
        document.addEventListener('mouseover', handleTextHover);
        document.addEventListener('mouseout', handleMouseLeave);

        // Add specific listeners for UI elements that might be missed
        const specificElements = [
            document.querySelector('.text-lg.font-bold'), // "Report Details" heading
            ...Array.from(document.querySelectorAll('.bg-blue-500, .bg-green-500, .bg-red-500')), // Buttons and badges
            ...Array.from(document.querySelectorAll('.font-bold')), // Bold elements like "Recent Reports"
        ];

        specificElements.forEach(element => {
            if (element) {
                element.addEventListener('mouseover', handleElementHover);
                element.addEventListener('mouseout', handleMouseLeave);
            }
        });

        // Cleanup function
        return () => {
            document.removeEventListener('mouseover', handleTextHover);
            document.removeEventListener('mouseout', handleMouseLeave);

            specificElements.forEach(element => {
                if (element) {
                    element.removeEventListener('mouseover', handleElementHover);
                    element.removeEventListener('mouseout', handleMouseLeave);
                }
            });

            stopSpeaking();
        };
    }, [textToSpeechEnabled, reportHTML]); // Re-run when reportHTML or TTS setting changes

    useEffect(() => {
        const storedSize = localStorage.getItem('textSize');
        if (storedSize) {
            setTextSize(storedSize);
        }
    }, []);

    return (
        <div
            style={{ fontFamily: useOpenDyslexic ? "'OpenDyslexic', sans-serif" : "Arial, sans-serif" }}
            className="flex bg-gradient-to-br from-[#91d2ff] to-[#72b4ea] min-h-screen">
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

                    {/* <div className="flex gap-2 mt-4">
                        <button onClick={() => setTextSize("text-base")} className="px-2 py-1 bg-gray-200 rounded">A-</button>
                        <button onClick={() => setTextSize("text-xl")} className="px-2 py-1 bg-gray-200 rounded">A</button>
                        <button onClick={() => setTextSize("text-2xl")} className="px-2 py-1 bg-gray-200 rounded">A+</button>
                    </div> */}


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
                                    <p className="text-sm">Report ID: {report.id}</p>
                                    <p className="text-sm">{uiText?.time || "Time"}: {report.time}</p>
                                    <p className={`text-sm font-bold ${report.severity === "High" ||
                                            report.severity === uiText.high ?
                                            "text-[#B22222]" : "text-orange-500"}`}
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
                        <h2 className="text-xl font-bold mb-4">Generate Attacker Profile Report</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block font-semibold">Attacker ID</label>
                                <input
                                    type="text"
                                    placeholder="e.g., 32"
                                    className="w-full p-2 border rounded"
                                    value={attackerIdInput}
                                    onChange={(e) => setAttackerIdInput(e.target.value)}	// so that search bars are separate
                                />
                            </div>

							<div>
								<button
									onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
									className="text-sm text-blue-600 hover:underline focus:outline-none mb-2"
								>
									{showAdvancedFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
								</button>

								{showAdvancedFilters && (
									<div>
										<label className="block font-semibold">Date Range (optional)</label>
										<input
											type="text"
											placeholder="e.g., 2024-01-01 to 2024-12-31"
											className="w-full p-2 border rounded"
										/>
									</div>
								)}
							</div>

                            <div>
                                <button
                                    onClick={async () => {
                                        setIsTranslating(true);
                                        setReportHTML("");  // Clear previous content

                                        try {
                                            const res = await fetch("/api/generate_narrative_report?attacker_id=" + attackerIdInput);
											// const res = await fetch("http://localhost:5000/api/generate_narrative_report?attacker_id=" + attackerIdInput); // changed for local testing
                                            const data = await res.json();

                                            if (res.ok) {
                                                setReportHTML(`
                                                    <div>
                                                        <h3 class="text-lg font-bold mb-2">Narrative Summary</h3>
                                                        <p>${data.narrative_summary.replace(/\n/g, "<br>")}</p>
                                                    </div>
                                                `);
												await fetchReportsFromBackend();

                                            } else {
                                                setReportHTML(`<div class="text-red-600">Error: ${data.error}</div>`);
                                            }
                                        } catch (error) {
                                            setReportHTML(`<div class="text-red-600">Request failed: ${error.message}</div>`);
                                        } finally {
                                            setIsTranslating(false);
                                        }
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                                >
                                    Generate Report
                                </button>

                            </div>

                            {isTranslating && (
                                <div className="flex items-center text-blue-500">
                                    <div className="animate-spin h-5 w-5 mr-2 border-2 border-t-transparent border-blue-500 rounded-full"></div>
                                    Generating report...
                                </div>
                            )}

                            {!isTranslating && reportHTML && (
                                <div
                                    className="p-4 border rounded-md bg-gray-50 mt-4 prose max-w-none"
                                    dangerouslySetInnerHTML={{ __html: reportHTML }}
                                />
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}