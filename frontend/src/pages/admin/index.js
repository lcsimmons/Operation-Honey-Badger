import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  UserCog,
  FileText,
  LifeBuoy,
  BarChart2,
  Building,
  Shield,
  UserCircle,
  Loader2
} from "lucide-react";

export default function AdminIndex() {
  const currentUser = "unverified.agent@opossum-dyn.internal";
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white text-gray-800">
        <Loader2 size={48} className="animate-spin text-gray-500 mb-4" />
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-10">
    <title>Opossum Dynamics Admin Panel</title>
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-1">Admin Panel</h1>
          <p className="text-sm text-yellow-700 flex items-center gap-1">
            <AlertTriangle size={16} />
            Admin access detected: <span className="font-medium">No role-based restrictions applied</span>
          </p>
        </div>

        <div className="text-right text-sm">
          <div className="flex items-center gap-2">
            <UserCircle size={20} />
            <span className="font-medium">{currentUser}</span>
          </div>
          <div className="mt-1">
            Access Level:{" "}
            <select className="border rounded px-1 py-0.5 bg-white text-sm text-gray-700 cursor-not-allowed" disabled>
              <option selected>Field Test Mode</option>
              <option>Full Admin</option>
              <option>Probationary Intern</option>
              <option>Unknown</option>
            </select>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-4">Home / Admin / Dashboard</div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
        <AdminCard href="/admin/employees" icon={<UserCog />} title="Employees" desc="Manage personnel records and aliases." />
        <AdminCard href="/admin/expenses" icon={<FileText />} title="Expenses" desc="View totally legitimate reimbursement logs." />
        <AdminCard href="/admin/it-support" icon={<LifeBuoy />} title="IT Support" desc="Ticket queue. May or may not exist." />
        <AdminCard href="/admin/performance" icon={<BarChart2 />} title="Performance" desc="View handpicked key performance indicators." />
        <AdminCard href="/admin/corporate" icon={<Building />} title="Corporate Projects" desc="Monitor vaguely defined initiatives." />
        <AdminCard href="/admin/security" icon={<Shield />} title="Security Logs" desc="Access logs Greg was told to delete." />
      </div>

      <footer className="mt-12 text-sm text-red-600 flex items-center gap-2">
        <AlertTriangle size={16} />
        This interface does not validate role permissions. Access may be accidental or legally dubious.
      </footer>

      {/* 
        TODO: add real role checks
        if (user.role !== 'admin') return redirect('/403');
        For now, leave open for testing. - Greg
      */}
    </div>
  );
}

function AdminCard({ href, icon, title, desc }) {
  return (
    <Link href={href}>
      <div
        className="border border-gray-300 rounded-lg p-5 hover:shadow-md transition-all cursor-pointer bg-gray-50"
        title={`Access ${title}`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gray-200 rounded-md text-gray-700">{icon}</div>
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            <p className="text-sm text-gray-600">{desc}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
