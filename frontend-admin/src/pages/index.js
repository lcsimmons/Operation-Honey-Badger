import { useState, useEffect } from "react";
import { useContext } from 'react'; import { FontContext } from '../context/FontContext';
import Sidebar from "../components/sidebar";
import AttackMatrix from "../components/AttackMatrix";
import { Search, HelpCircle } from "lucide-react";
import { PieChart, Legend, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { LanguageContext } from '@/context/LanguageContext';

const pieData = [
  { name: "Item 1", value: 20 },
  { name: "Item 2", value: 20 },
  { name: "Item 3", value: 20 },
  { name: "Item 4", value: 20 },
  { name: "Item 5", value: 20 },
];

const attackerIntentData = [
  { name: "Recon", value: 34 },
  { name: "Credential Access", value: 27 },
  { name: "Privilege Escalation", value: 19 },
  { name: "Persistence", value: 13 },
  { name: "Lateral Movement", value: 7 },
];


const commonExploitsData = [
  { name: "Remote Code Exec", value: 80 },
  { name: "SQL Injection", value: 65 },
  { name: "Cross-Site Scripting", value: 50 },
  { name: "Buffer Overflow", value: 35 },
  { name: "Privilege Escalation", value: 20 },
];

const attackerInputsData = [
  { name: "SQL Injection", value: 40 },
  { name: "XSS Payload", value: 30 },
  { name: "Command Injection", value: 15 },
  { name: "Directory Traversal", value: 10 },
  { name: "Encoded Script Tags", value: 5 },
];

const attackTypeData = [
  { name: "Phishing", value: 30 },
  { name: "Malware", value: 25 },
  { name: "Brute Force", value: 20 },
  { name: "Insider Threat", value: 15 },
  { name: "Ransomware", value: 10 },
];

const engagementTimeData = [
  { name: "Mar 16", value: 22 },
  { name: "Mar 17", value: 18 },
  { name: "Mar 18", value: 35 },
  { name: "Mar 19", value: 40 },
  { name: "Mar 20", value: 25 },
];

const attackFrequencyByHour = [
  { hour: "00:00", attacks: 4 },
  { hour: "04:00", attacks: 9 },
  { hour: "08:00", attacks: 5 },
  { hour: "12:00", attacks: 7 },
  { hour: "16:00", attacks: 6 },
  { hour: "20:00", attacks: 13 },
];


const barData = [
  { name: "Metric 1", value: 80 },
  { name: "Metric 2", value: 60 },
  { name: "Metric 3", value: 40 },
  { name: "Metric 4", value: 20 },
];

const COLORS = [
  "#1b9e77", // Teal
  "#d95f02", // Orange
  "#7570b3", // Purple
  "#e7298a", // Pink
  "#66a61e", // Olive Green
  "#e6ab02", // Mustard
  "#a6761d", // Brown
  "#666666", // Gray
];

// Placeholder tactic frequencies (replace with backend API data later)
const tacticFrequencies = {
  "Initial Access": { techniques: 9, frequency: 5 },
  "Execution": { techniques: 10, frequency: 15 },
  "Persistence": { techniques: 18, frequency: 10 },
  "Privilege Escalation": { techniques: 12, frequency: 8 },
  "Defense Evasion": { techniques: 37, frequency: 20 },
  "Credential Access": { techniques: 14, frequency: 12 },
  "Discovery": { techniques: 25, frequency: 18 },
  "Lateral Movement": { techniques: 9, frequency: 6 },
  "Collection": { techniques: 17, frequency: 9 },
};

// Placeholder techniques (simulating MITRE ATT&CK techniques)
const attackTechniques = {
  "Initial Access": ["Phishing", "Drive-by Compromise", "Valid Accounts"],
  "Execution": ["Command and Scripting Interpreter", "Scheduled Task/Job"],
  "Persistence": ["Browser Extensions", "Boot or Logon Initialization Scripts"],
  "Privilege Escalation": ["Process Injection", "Access Token Manipulation"],
  "Defense Evasion": ["Obfuscated Files or Information", "Modify Registry"],
  "Credential Access": ["OS Credential Dumping", "Brute Force"],
  "Discovery": ["System Information Discovery", "File and Directory Discovery"],
  "Lateral Movement": ["Remote Services", "Exploitation of Remote Services"],
  "Collection": ["Clipboard Data", "Automated Collection"],
};

// Function to get colorblind-friendly color based on frequency
const getColor = (frequency) => {
  if (frequency >= 15) return "bg-[#023047] text-white"; // High frequency (Dark Blue)
  if (frequency >= 10) return "bg-[#FB8500] text-black"; // Medium frequency (Orange)
  if (frequency >= 5) return "bg-[#219EBC] text-black"; // Low frequency (Light Blue)
  return "bg-gray-200 text-black"; // Very low frequency (Gray)
};

export default function Dashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const { useOpenDyslexic } = useContext(FontContext);
  const { language } = useContext(LanguageContext);

  const [uiText, setUiText] = useState({
    dashboardTitle: "Admin Dashboard",
    searchPlaceholder: "Search Dashboard...",
    commonExploits: "Common Exploits",
    recentReports: "Recent Reports",
    reportSeverity: "Report Severity",
    engagementTime: "Engagement Time",
    commonExploitsUsed: "Common Exploits Used",
    detectedAttackerIntent: "Detected Attacker Intent",
    attackTypes: "Attack Types",
    attackerInputs: "Attacker Inputs"
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

  return (
    <div 
    style={{ fontFamily: useOpenDyslexic ? "'OpenDyslexic', sans-serif" : "Arial, sans-serif" }} 
    className="flex bg-gradient-to-br from-[#91d2ff] to-[#72b4ea] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 text-black ml-20 transition-all duration-300">
        {/* TopBar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg m-4">
          <h1 className="text-xl font-semibold">
            Operation Honey Badger: <span className="font-bold">{uiText.dashboardTitle}</span>
          </h1>

          {/* Search Bar */}
          <div className="flex items-center w-2/3 bg-gray-100 p-2 rounded-lg">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search Dashboard..."
              className="bg-transparent outline-none ml-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Help Icon */}
          <HelpCircle size={24} className="cursor-pointer text-gray-500 hover:text-black" />
        </div>

        {/* Dashboard Content */}
        <div className="grid grid-cols-3 gap-6 p-6">
          {/* Nope */}
          <div className="bg-white/40 p-4 rounded-lg shadow-md flex flex-col">
            <h2 className="text-lg font-bold">{uiText.commonExploits}</h2>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={commonExploitsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {commonExploitsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 text-sm">
              {commonExploitsData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports & Report Severity */}
          <div className="grid grid-rows-2 gap-6">
            {/* Recent Reports */}
            <div className="bg-white/40 p-4 rounded-lg shadow-md flex flex-col items-center">
              <h2 className="text-lg font-bold">{uiText.recentReports}</h2>
              <p className="text-8xl text-black mt-2">8</p>
            </div>

            {/* Report Severity */}
            <div className="bg-white/40 p-4 rounded-lg shadow-md flex flex-col items-center">
              <h2 className="text-lg font-bold">{uiText.reportSeverity}</h2>
              <p className="text-8xl text-red-600 mt-2">High</p>
            </div>
          </div>

          {/* Bar Charts */}
          <div className="row-span-21 bg-white/40 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-2">{uiText.engagementTime}</h2>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={engagementTimeData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FFA500" />
              </BarChart>
            </ResponsiveContainer>

            <h2 className="text-lg font-bold mt-6 mb-2">{uiText.commonExploitsUsed}</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={commonExploitsData} margin={{ top: 5, right: 10, left: 0, bottom: 50 }}>
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#007FFF" />
              </BarChart>
            </ResponsiveContainer>

            <h2 className="text-lg font-bold mt-6 mb-2">{uiText.detectedAttackerIntent}</h2>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={attackerIntentData} margin={{ top: 5, right: 10, left: 0, bottom: 50 }}>
                <XAxis
                  dataKey="name"
                  interval={0}
                  angle={-25}
                  textAnchor="end"
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4CAF50" />
              </BarChart>
            </ResponsiveContainer>

          </div>



          {/* Attack Types & Attacker Inputs */}
          <div className="col-span-2 row-span-20 bg-white/40 p-6 rounded-lg shadow-md">
            <div className="flex justify-between gap-6 h-full">
              {/* Attack Types */}
              <div className="flex flex-col items-center w-1/2 h-full">
                <h3 className="text-3xl font-bold mb-4">{uiText.attackTypes}</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={attackTypeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {attackTypeData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Legend */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 text-sm">
                  {attackTypeData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attacker Inputs */}
              <div className="flex flex-col items-center w-1/2 h-full">
                <h3 className="text-3xl font-bold mb-4">{uiText.attackerInputs}</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={attackerInputsData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {attackerInputsData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                {/* Custom Legend */}
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 text-sm">
                  {attackerInputsData.map((entry, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>



          {/* MITRE ATT&CK Matrix */}
          {/* <div className="col-span-3 row-span-30 bg-white/40 p-4 rounded-lg shadow-md flex flex-col"> */}
          <AttackMatrix />
          {/* </div> */}

          {/* Another thing */}
          <div className="col-span-3 row-span-30 bg-white/40 p-4 rounded-lg shadow-md flex flex-col">
            <h2 className="text-lg font-bold">LOL</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Another thing */}
          <div className="col-span-3 row-span-30 bg-white/40 p-4 rounded-lg shadow-md flex flex-col">
            <h2 className="text-lg font-bold">LOL</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Another thing */}
          <div className="col-span-3 row-span-30 bg-white/40 p-4 rounded-lg shadow-md flex flex-col">
            <h2 className="text-lg font-bold">LOL</h2>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={60} fill="#8884d8" dataKey="value">
                  {pieData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
