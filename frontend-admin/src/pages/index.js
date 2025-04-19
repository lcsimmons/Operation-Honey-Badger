import { useState, useEffect } from "react";
import { useContext } from 'react'; 
import { FontContext } from '../context/FontContext';
import Sidebar from "../components/sidebar";
import AttackMatrix from "../components/AttackMatrix";
import WorldMap from "../components/WorldMap";
import { Search, HelpCircle } from "lucide-react";
import { PieChart, Legend, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useTextSize } from '@/context/TextSizeContext';
import { getCommonExploits } from './api/apiHelper';

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
  "#E69F00", // orange
  "#56B4E9", // sky blue
  "#009E73", // bluish green
  "#F0E442", // yellow
  "#0072B2", // blue
  "#D55E00", // vermillion
  "#CC79A7", // reddish purple
];


// Placeholder tactic frequencies
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

  const components = [
    {
      name: "Common Exploits",
      render: <CommonExploits />,
      className: "bg-white/40 p-4 rounded-lg shadow-md flex flex-col"
    },
    {
      name: "Recent Reports & Report Severity",
      render: <RecentReportsAndReportSeverity />,
      className: "grid gap-6"
    },
    {
      name: "Bar Charts",
      render: <BarCharts />,
      className: "row-span-2 bg-white/40 p-4 rounded-lg shadow-md"
    },
    {
      name: "Attack Types & Attacker Inputs", 
      render: <AttackTypesAndAttackerInputs/>,
      className: "col-span-2 row-span-2 bg-white/40 p-6 rounded-lg shadow-md"
    },
    {
      name: "Attacker Geolocation",
      render: <WorldMap />,
      className: "col-span-3 row-span-2 bg-white/40 p-4 rounded-lg shadow-md flex flex-col"
    },
    {
      name: "MITRE Attack", 
      render: <AttackMatrix/>,
      className: "col-span-3 row-span-3 bg-white/40 p-4 rounded-lg shadow-md flex flex-col"
    },
    {
      name: "LOL", 
      render: <LOL/>,
      className: "col-span-3 row-span-3 bg-white/40 p-4 rounded-lg shadow-md flex flex-col"
    }
  ];

  // SearchBar functionality
  const searchComponents = (component) => {
    return component.name.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const { textSize } = useTextSize();


  return (
    <div
      style={{ fontFamily: useOpenDyslexic ? "'OpenDyslexic', sans-serif" : "Arial, sans-serif" }}
      className={`flex min-h-screen bg-gradient-to-br from-[#91d2ff] to-[#72b4ea] ${textSize}`}>
      <title>Administrator Dashboard</title>
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 text-black ml-20 transition-all duration-300">
        {/* TopBar */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg m-4">
          <h1 className="font-semibold">
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
          {components.filter(searchComponents).map((component, index) => (
            <div
              key={index}
              className={component.className}
            >
              {component.render}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
const CommonExploits = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCommonExploits = async () => {
      const res = await getCommonExploits();
      if (res && res.status === 200) {
        const formatted = res.data.map(entry => ({
          name: entry.owasp_technique,
          value: entry.count
        }));
        setData(formatted);
      } else {
        console.error("Failed to fetch common exploits:", res);
      }
      setLoading(false);
    };

    fetchCommonExploits();
  }, []);

  if (loading) return <p className="text-center">Loading chart...</p>;

  return (
    <div>
      <h2 className="font-bold">Common Exploits</h2>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={3}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3">
        {data.map((entry, index) => (
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
  );
};

{/* Recent Reports & Report Severity */ }
const RecentReportsAndReportSeverity = () => (
  <div className="bg-white/40 p-4 rounded-lg shadow-md flex flex-col justify-between h-full">
    <div className="flex flex-col items-center">
      <h2 className=" font-bold">Recent Reports</h2>
      <p className="text-8xl text-black mt-2">8</p>
    </div>
    <div className="flex flex-col items-center mt-6">
      <h2 className=" font-bold">Report Severity</h2>
      <p className="text-8xl text-red-600 mt-2">High</p>
    </div>
  </div>
);


{/* Bar Charts */ }
const BarCharts = () => (
  <div>
    <h2 className=" font-bold mb-2">Engagement Time</h2>
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={engagementTimeData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" fill={COLORS[0]} />
      </BarChart>
    </ResponsiveContainer>

    <h2 className=" font-bold mt-6 mb-2">Common Exploits Used</h2>
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
        <Bar dataKey="value" fill={COLORS[1]} />
      </BarChart>
    </ResponsiveContainer>

    <h2 className=" font-bold mt-6 mb-2">Detected Attacker Intent</h2>
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
        <Bar dataKey="value" fill={COLORS[2]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

{/* Attack Types & Attacker Inputs */ }
const AttackTypesAndAttackerInputs = () => (
  <div>
    <div className="flex justify-between gap-6 h-full">
      {/* Attack Types */}
      <div className="flex flex-col items-center w-1/2 h-full">
        <h3 className="text-3xl font-bold mb-4">Attack Types</h3>
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
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 ">
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
        <h3 className="text-3xl font-bold mb-4">Attacker Inputs</h3>
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
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-3 ">
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
);

{/* Another thing */ }
const LOL = () => (
  <div>
    <div>
      <h2 className=" font-bold">LOL</h2>
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
);