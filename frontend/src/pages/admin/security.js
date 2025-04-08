import { Shield } from "lucide-react";

export default function SecurityPage() {
  return (
    <div className="min-h-screen bg-white p-10 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <Shield size={28} /> Security & Compliance
      </h1>

      <p className="text-gray-600 mb-4">
        This page contains sensitive audit logs. However, access controls appear improperly configured.
      </p>

      <div className="bg-gray-100 border border-red-300 p-4 rounded-lg text-sm">
        <p><strong>Status:</strong> Internal log exposure detected.</p>
        <p><strong>Note:</strong> This log view is not restricted by user role.</p>
        <ul className="list-disc pl-6 mt-2 text-gray-700">
          <li>Login anomalies: suspicious tokens bypassed MFA</li>
          <li>5 unauthorized attempts from admin role "qa-testing"</li>
          <li>Config file leaked over GET `/env-vars/` endpoint</li>
        </ul>
      </div>
    </div>
  );
}
