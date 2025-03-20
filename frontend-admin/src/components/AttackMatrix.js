import { useState } from "react";


// Define color coding for severity levels
const getColor = (frequency) => {
  if (frequency >= 15) return "bg-red-600 text-white"; // High severity
  if (frequency >= 10) return "bg-orange-400 text-black"; // Medium severity
  if (frequency >= 5) return "bg-yellow-300 text-black"; // Low severity
  return "bg-gray-200 text-black"; // Minimal severity
};

// Data for MITRE ATT&CK matrix
const tactics = [
  "Initial Access", "Execution", "Persistence", "Privilege Escalation",
  "Defense Evasion", "Credential Access", "Discovery", "Lateral Movement", "Collection",
];

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

export default function AttackMatrix() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="col-span-3 row-span-30 bg-white/40 p-4 rounded-lg shadow-md flex flex-col">
      {/* Header & Search */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">MITRE ATT&CK Matrix</h2>
        <input
          type="text"
          placeholder="Search techniques..."
          className="p-2 border rounded-lg w-1/3"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ATT&CK Matrix Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-300 text-black">
              {tactics.map((tactic) => (
                <th key={tactic} className="px-4 py-2 text-left border">{tactic}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {tactics.map((tactic) => (
                <td
                  key={tactic}
                  className={`px-4 py-2 border font-bold text-center ${getColor(
                    tacticFrequencies[tactic]?.frequency || 0
                  )}`}
                >
                  {tacticFrequencies[tactic]?.frequency || 0} Reports
                </td>
              ))}
            </tr>
            <tr>
              {tactics.map((tactic) => (
                <td key={tactic} className="px-4 py-2 border align-top text-xs">
                  {attackTechniques[tactic]?.map((technique, index) => (
                    <div key={index} className="py-1">{technique}</div>
                  )) || "-"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
