import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";

export default function Settings() {
  // Start with definite boolean values instead of null
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  // Start with false but update immediately on mount
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  
  // Load settings from localStorage only once on component mount
  useEffect(() => {
    // Load language setting
    const savedLanguage = localStorage.getItem('reportLanguage');
    if (savedLanguage) {
      setSelectedLanguage(savedLanguage);
    }
    
    // Load text-to-speech setting - parse as boolean explicitly
    const savedTTS = localStorage.getItem('textToSpeechEnabled');
    // Make sure we're explicitly parsing as boolean
    const ttsEnabled = savedTTS === 'true';
    setTextToSpeechEnabled(ttsEnabled);
    
    console.log('Settings page loaded TTS setting:', savedTTS, 'Parsed as:', ttsEnabled);
    console.log('Settings page loaded language setting:', savedLanguage);
  }, []);
  
  // Save language setting when it changes
  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    // Immediately update localStorage with the new value
    localStorage.setItem('reportLanguage', newLanguage);
    console.log('Language changed to:', newLanguage, 'Saved to localStorage as:', newLanguage);
  };
  
  // Save text-to-speech setting immediately when it changes
  const handleTTSToggle = (e) => {
    const newValue = e.target.checked;
    setTextToSpeechEnabled(newValue);
    // Immediately update localStorage with the new value
    localStorage.setItem('textToSpeechEnabled', String(newValue));
    console.log('TTS checkbox toggled to:', newValue, 'Saved to localStorage as:', String(newValue));
  };

  // stores the text size locally
  const [textSize, setTextSize] = useState(() => {
    return localStorage.getItem('textSize') || 'text-base';
  });
  
  // Text sizes based on label
  const sizes = [
    { label: "Small", value: "text-sm" },
    { label: "Normal", value: "text-base" },
    { label: "Big", value: "text-xl" },
    { label: "Bigger", value: "text-2xl" },
    { label: "Huge", value: "text-3xl" },
  ];

  const handleSizeClick = (value) => {
    setTextSize(value);
    localStorage.setItem('textSize', value);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#91d2ff] to-[#72b4ea]">
      <Sidebar />
      <div className="flex-1 text-black ml-20 transition-all duration-300">
        <div className="grid grid-cols-3 gap-6 p-6">
          {/* TopBar */}
          {/* <div className="col-span-20 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-4 mr-4 ml-4">
            <h1 className="text-xl font-semibold">
              General Settings
            </h1>
          </div> */}

          {/* General Settings */}
          {/* <div className="col-span-20 row-span-10 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            
          </div> */}

          {/* MidBar */}
          {/* <div className="col-span-20 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            <h1 className="text-xl font-semibold">
              Admin Dashboard Settings
            </h1>
          </div> */}

          {/* Admin Dashboard Settings */}
          {/* <div className="col-span-20 row-span-10 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            
          </div> */}

          {/* BottomBar */}
          {/* <div className="col-span-20 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            <h1 className="text-xl font-semibold">
              Logs Settings
            </h1>
          </div> */}

          {/* Logs Settings */}
          {/* <div className="col-span-20 row-span-10 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            
          </div> */}

          {/* BottomBar */}
          <div className="col-span-20 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            <h1 className="text-xl font-semibold">
              Reports Accessibility Settings
            </h1>
          </div>

          {/* Reports Settings */}
          <div className="col-span-20 row-span-10 flex flex-col px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            <div className="mb-4">
              <h2 className="text-lg font-medium mb-2">Report Language Translation</h2>
              <p className="text-sm text-gray-600 mb-4">
                Select your preferred language for SOC admin reports. Reports will be automatically translated to this language.
              </p>
              
              <div className="flex items-center space-x-4">
                <label htmlFor="language-select" className="text-sm font-medium">
                  Default Language:
                </label>
                <select 
                  id="language-select"
                  value={selectedLanguage}
                  onChange={handleLanguageChange}
                  className="bg-white border border-gray-300 text-gray-700 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="ja">Japanese</option>
                  <option value="zh">Chinese (Simplified)</option>
                  <option value="ar">Arabic</option>
                  <option value="ru">Russian</option>
                  <option value="pt">Portuguese</option>
                  <option value="ko">Korean</option>
                  <option value="vi">Vietnamese</option>
                  <option value="hi">Hindi</option>
                </select>
              </div>
            </div>
            
            {/* Text-to-Speech Option with explicit onChange handler */}
            <div className="mb-4">
              <h2 className="text-lg font-medium mb-2">Text-to-Speech</h2>
              <p className="text-sm text-gray-600 mb-4">
                Enable text-to-speech functionality for report details. When enabled, text in reports will be read aloud when you hover over it.
              </p>
              
              <div className="flex items-center space-x-2">
                <input 
                  type="checkbox" 
                  id="text-to-speech-checkbox"
                  checked={textToSpeechEnabled}
                  onChange={handleTTSToggle}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="text-to-speech-checkbox" className="text-sm font-medium text-gray-700">
                  Enable Text-to-Speech
                </label>
              </div>
              
              {/* Debug info - can be removed in production */}
              <div className="text-xs text-gray-500 mt-1">
                Current setting: {textToSpeechEnabled ? 'Enabled' : 'Disabled'}
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-1">About Translation</h3>
              <p className="text-xs text-blue-600">
                Translation is powered by Google Translate API. Please note that while translations are generally accurate,
                some technical security terms may not translate perfectly. Critical security information will always be 
                available in English as a fallback.
              </p>
            </div>

            <h2 className="text-lg font-medium mb-2 mt-4">Adjust Text Sizing on Report</h2>
            <div className="p-3">
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size.value}
                    onClick={() => handleSizeClick(size.value)}
                    className={`px-3 py-1 rounded-md border ${
                      textSize === size.value ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
              <p className={`mt-4 ${textSize}`}>Preview: The quick brown fox jumps over the lazy dog</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}