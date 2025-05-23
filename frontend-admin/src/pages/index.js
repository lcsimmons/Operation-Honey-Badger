import { useState, useEffect } from "react";
import { useContext } from 'react'; 
import { FontContext } from '../context/FontContext';
import Sidebar from "../components/sidebar";
import AttackMatrix from "../components/AttackMatrix";
import WorldMap from "../components/WorldMap";
import { Search, HelpCircle } from "lucide-react";
import { PieChart, Legend, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { useTextSize } from '@/context/TextSizeContext';
import { getCommonExploits, getAttackerIP, getAttackerOS, getPagesTargeted, getBrowsersUsed, getEngagementTime, getTotalReportsGenerated } from './api/apiHelper';
import { useDashboardText } from '../components/translate';

const COLORS = [
  "#E69F00", // orange
  "#56B4E9", // sky blue
  "#009E73", // bluish green
  "#F0E442", // yellow
  "#0072B2", // blue
  "#D55E00", // vermillion
  "#CC79A7", // reddish purple
];

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
  const uiText = useDashboardText();

  const components = [
    {
      name: "Common Exploits",
      render: <CommonExploits uiText={uiText}/>,
      className: "bg-white/40 p-4 rounded-lg shadow-md flex flex-col"
    },
    {
      name: "Recent Reports & Report Severity",
      render: <RecentReportsAndReportSeverity uiText={uiText}/>,
      className: "grid gap-6"
    },
    {
      name: "Bar Charts",
      render: <BarCharts uiText={uiText}/>,
      className: "row-span-2 bg-white/40 p-4 rounded-lg shadow-md"
    },
    {
      name: "Attacker IPs & Attacker OS",
      render: <AttackerIPsAndAttackerOS uiText={uiText}/>,
      className: "col-span-2 row-span-1 bg-white/40 p-6 rounded-lg shadow-md"
    },
    {
      name: "Attacker Geolocation",
      render: <WorldMap uiText={uiText}/>,
      className: "col-span-3 row-span-2 bg-white/40 p-4 rounded-lg shadow-md flex flex-col"
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
        <div className="flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-4 mx-4 mb-0">
          <h1 className="font-semibold">
            {uiText.heading} <span className="font-bold">{uiText.subheading}</span>
          </h1>

          {/* Search Bar */}
          <div className="flex items-center w-2/3 bg-gray-100 p-2 rounded-lg">
            <Search size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder={uiText.searchPlaceholder}
              className="bg-transparent outline-none ml-2 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
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
const CommonExploits = ({ uiText }) => {
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
      <h2 className="font-bold">{uiText.commonExploitsTitle}</h2>
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
const RecentReportsAndReportSeverity = ({uiText}) => {
  const [loading, setLoading] = useState(true);
  const [recentReport, setRecentReport] = useState(0);

  useEffect(() => {
    const fetchRecentReportsCount = async () => {
      const res = await getTotalReportsGenerated();
      if (res && res.status === 200) {
        const count = res.data.count;
        setRecentReport(count);
      } else {
        console.error("Failed to fetch recent reports count:", res);
      }
      setLoading(false);
    };

    fetchRecentReportsCount();
  }, []);

  return (
    <div className="bg-white/40 p-4 rounded-lg shadow-md flex flex-col justify-between h-full">
      <div className="flex flex-col items-center">
        <h2 className=" font-bold">{uiText.recentReports}</h2>
        {loading && ( <p className="text-center">{uiText.reportsLoading}</p>)}
        {!loading && (<p className="text-8xl text-black mt-2">{recentReport}</p>)}
      </div>
    </div>
  );
};


// {/* Bar Charts */ }
const BarCharts = ({uiText}) => {
  const [engagementData, setEngagementData] = useState([]);
  const [pagesData, setPagesData] = useState([]);
  const [browserData, setBrowserData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCharts = async () => {
      const [engagement, pages, browsers] = await Promise.all([
        getEngagementTime(), 
        getPagesTargeted(),
        getBrowsersUsed()
      ]);

      if (engagement && Array.isArray(engagement)) {
        const aggregationMap = new Map();
        engagement.forEach(entry => {
          const day = new Date(entry.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          const prev = aggregationMap.get(day) || 0;
          aggregationMap.set(day, prev + entry.occurrences);
        });
        const aggregatedData = Array.from(aggregationMap.entries()).map(([name, value]) => ({ name, value }));
        setEngagementData(aggregatedData);
      }

      if (pages && Array.isArray(pages)) {
        setPagesData(pages.map(entry => ({
          name: entry.request_url,
          value: entry.count,
        })));
      }

      if (browsers && Array.isArray(browsers)) {
        setBrowserData(browsers.map(entry => ({
          name: entry.browser,
          value: entry.count,
        })));
      }

      setLoading(false);
    };

    fetchCharts();
  }, []);

  return (
    <div>
      <h2 className=" font-bold mb-2">{uiText.attackerEngagement}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={150}>
          <BarChart data={engagementData} margin={{ top: 5, right: 10, left: 0, bottom: 20 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value}`, 'Total Sessions']}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="value" fill={COLORS[0]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      <h2 className=" font-bold mt-4 mb-2">{uiText.endpointsTargeted}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={pagesData} margin={{ top: 5, right: 10, left: 0, bottom: 50 }}>
            <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value}`, 'Count']}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="value" fill={COLORS[1]} />
          </BarChart>
        </ResponsiveContainer>
      )}

      <h2 className=" font-bold mt-6 mb-2">{uiText.browsersUsed}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={browserData} margin={{ top: 5, right: 10, left: 0, bottom: 50 }}>
            <XAxis dataKey="name" interval={0} angle={-25} textAnchor="end" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${value}`, 'Count']}
              labelFormatter={(label) => label}
            />
            <Bar dataKey="value" fill={COLORS[2]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const AttackerIPsAndAttackerOS = ({uiText}) => {
  const [ipData, setIpData] = useState([]);
  const [osData, setOsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const ipRaw = await getAttackerIP();
      const osRaw = await getAttackerOS();

      if (ipRaw && Array.isArray(ipRaw)) {
        setIpData(ipRaw.map(entry => ({
          name: entry.ip_address,
          value: entry.count,
        })));
      }

      if (osRaw && Array.isArray(osRaw)) {
        setOsData(osRaw.map(entry => ({
          name: entry.os,
          value: entry.count,
        })));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="flex justify-between gap-6">
      {/* Attacker IPs */}
      <div className="flex flex-col w-1/2">
        <h2 className="font-bold text-left">{uiText.attackerIP}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={ipData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {ipData.map((_, index) => (
                    <Cell key={`cell-ip-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
              {ipData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Attacker OS */}
      <div className="flex flex-col w-1/2">
        <h2 className="font-bold text-left">{uiText.attackerOS}</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={osData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {osData.map((_, index) => (
                    <Cell key={`cell-os-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-1">
              {osData.map((entry, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span>{entry.name}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};