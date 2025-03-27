import { useState } from "react";
import Sidebar from "../components/sidebar";
import AttackMatrix from "../components/AttackMatrix";
import { Search, HelpCircle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

const pieData = [
  { name: "Item 1", value: 20 },
  { name: "Item 2", value: 20 },
  { name: "Item 3", value: 20 },
  { name: "Item 4", value: 20 },
  { name: "Item 5", value: 20 },
];

const barData = [
  { name: "Metric 1", value: 80 },
  { name: "Metric 2", value: 60 },
  { name: "Metric 3", value: 40 },
  { name: "Metric 4", value: 20 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

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

  return (
    <div className="flex bg-gradient-to-br from-[#91d2ff] to-[#72b4ea] min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 text-black ml-20 transition-all duration-300">
        {/* TopBar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg m-4">
          <h1 className="text-xl font-semibold">
            Operation Honey Badger: <span className="font-bold">Admin Dashboard</span>
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
            <h2 className="text-lg font-bold">ATtack data</h2>
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

          {/* Recent Reports & Report Severity */}
          <div className="grid grid-rows-2 gap-6">
            {/* Recent Reports */}
            <div className="bg-white/40 p-4 rounded-lg shadow-md flex flex-col items-center">
              <h2 className="text-lg font-bold">Recent Reports</h2>
              <p className="text-5xl font-bold text-black mt-2">8</p>
            </div>

            {/* Report Severity */}
            <div className="bg-white/40 p-4 rounded-lg shadow-md flex flex-col items-center">
              <h2 className="text-lg font-bold">Report Severity</h2>
              <p className="text-5xl font-bold text-red-600 mt-2">High</p>
            </div>
          </div>

          {/* Bar Charts */}
          <div className="row-span-21 bg-white/40 p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-bold">Engagement Time</h2>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FFA500" />
              </BarChart>
            </ResponsiveContainer>
            <h2 className="text-lg font-bold mt-4">Common Exploits Used</h2>
            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#007FFF" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Attack Types */}
          <div className="col-span-2 row-span-20 bg-white/40 p-4 rounded-lg shadow-md flex flex-col">
            <h2 className="text-lg font-bold">Attack Types</h2>
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
