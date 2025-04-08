import { useEffect, useState } from "react";
import { getCorporateProjects } from "../api/apiHelper";
import { Building } from "lucide-react";

export default function CorporatePage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    getCorporateProjects().then(res => {
      if (res?.data) setProjects(res.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white p-10 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Building size={28} /> Corporate Initiatives
      </h1>
      <Table data={projects} columns={["project_id", "name", "owner", "status", "deadline"]} />
    </div>
  );
}

function Table({ data, columns }) {
  if (!data || data.length === 0) return <p className="text-gray-600">No data available.</p>;

  return (
    <div className="overflow-x-auto border border-gray-300 rounded-lg">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-200 text-gray-700 uppercase">
          <tr>{columns.map(col => <th key={col} className="p-3">{col}</th>)}</tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="even:bg-gray-50 odd:bg-white">
              {columns.map(col => (
                <td key={col} className="p-3">{row[col]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
