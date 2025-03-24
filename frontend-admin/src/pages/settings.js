import Sidebar from "../components/sidebar";
import { useState, useEffect } from "react";

export default function Settings() {
  // Start with null to indicate we haven't loaded the preference yet
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  
  // Load the language preference from localStorage only once on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('reportLanguage');
    // Set to English only if nothing is saved, otherwise use the saved value
    setSelectedLanguage(savedLanguage || "en");
  }, []);
  
  // Only save to localStorage when the language is changed by the user
  // and not during the initial load
  useEffect(() => {
    // Only save if selectedLanguage is not null (meaning it's been loaded or changed)
    if (selectedLanguage !== null) {
      localStorage.setItem('reportLanguage', selectedLanguage);
    }
  }, [selectedLanguage]);

  // Don't render the language selector until the saved preference is loaded
  if (selectedLanguage === null) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-[#91d2ff] to-[#72b4ea]">
        <Sidebar />
        <div className="flex-1 text-black ml-20 transition-all duration-300">
          <div className="p-6">
            <div className="bg-white/40 backdrop-blur-lg shadow-md rounded-lg p-6">
              Loading settings...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#91d2ff] to-[#72b4ea]">
      <Sidebar />
      <div className="flex-1 text-black ml-20 transition-all duration-300">
        <div className="grid grid-cols-3 gap-6 p-6">
          {/* TopBar */}
          <div className="col-span-20 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-4 mr-4 ml-4">
            <h1 className="text-xl font-semibold">
              General Settings
            </h1>
          </div>

          {/* General Settings */}
          <div className="col-span-20 row-span-10 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            
          </div>

          {/* MidBar */}
          <div className="col-span-20 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            <h1 className="text-xl font-semibold">
              Admin Dashboard Settings
            </h1>
          </div>

          {/* Admin Dashboard Settings */}
          <div className="col-span-20 row-span-10 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            
          </div>

          {/* BottomBar */}
          <div className="col-span-20 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            <h1 className="text-xl font-semibold">
              Logs Settings
            </h1>
          </div>

          {/* Logs Settings */}
          <div className="col-span-20 row-span-10 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            
          </div>

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
                  onChange={(e) => setSelectedLanguage(e.target.value)}
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
                </select>
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
          </div>
        </div>
      </div>
    </div>
  );
}