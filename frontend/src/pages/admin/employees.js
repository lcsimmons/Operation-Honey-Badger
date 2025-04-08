import { useEffect, useState } from "react";
import { getEmployees } from "../api/apiHelper";
import { Users } from "lucide-react";

export default function EmployeeAdminPage() {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    getEmployees().then(res => {
      if (res?.data) setEmployees(res.data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-white p-10 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Users size={28} /> Employee Directory
      </h1>
      <Table data={employees} columns={["id", "name", "email", "role"]} />
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
