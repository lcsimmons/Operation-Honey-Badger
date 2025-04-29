import { Shield } from "lucide-react";
import { getSecurityLogs } from "../api/apiHelper";
import { useEffect, useState } from "react";

export default function SecurityPage() {
  const [securitLogs, setSecurityLogs] = useState([]);

  useEffect(() => {
    getSecurityLogs().then(res => {
      if (res?.data) setSecurityLogs(res.data);
    });
  }, []);

  
  return (
    <div className="min-h-screen bg-white p-10 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Shield size={28} /> Security & Compliance
      </h1>

      <p className="text-gray-600 mb-4">
        This page contains sensitive audit logs. However, access controls appear improperly configured.
      </p>

      <div className="bg-gray-200 border border-red-300 p-4 rounded-lg text-sm">
        <p><b>Status:</b> Internal log exposure detected.</p>
        <p><b>Note:</b> This log view is not restricted by user role.</p>
      </div>
    </div>
  );
}
