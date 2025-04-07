import Link from "next/link";

export default function AdminPage() {
  const router = useRouter(); 
  const handleLogout = () => {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("username");
    localStorage.removeItem("avatar");
  
    try {
      router.push("/login");
    } catch (err) {
      console.error("Logout redirect failed:", err);
    }
};
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-gray-800 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-6">Opossum Dynamics</h1>
        <nav className="space-y-4">
          <Link href="/">
            <p className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
              🔍 Dashboard Overview
            </p>
          </Link>
          <Link href="/employees">
            <p className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
              👥 Employee Management
            </p>
          </Link>
          <Link href="/expenses">
            <p className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
              💰 Expense Reimbursements
            </p>
          </Link>
          <Link href="/it-support">
            <p className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
              🖥️ IT Support & Infrastructure
            </p>
          </Link>
          <Link href="/performance">
            <p className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
              📊 Performance Analytics
            </p>
          </Link>
          <Link href="/corporate">
            <p className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
              🏢 Corporate Initiatives
            </p>
          </Link>
          <Link href="/security">
            <p className="p-3 bg-gray-700 rounded-lg hover:bg-gray-600 cursor-pointer">
              🔒 Security & Compliance
            </p>
          </Link>
        </nav>
        <div className="mt-auto">
          <button
            className="w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-lg mt-6"
            onClick={() => alert("Logging out...")}
          >
            🚪 Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Admin Control Panel</h2>
          <p className="text-gray-600">
            Welcome to the Opossum Dynamics admin dashboard. Use the navigation panel to manage internal operations, access employee data, and oversee company infrastructure.
          </p>

          {/* System Overview Section */}
          <div className="mt-6 grid grid-cols-3 gap-6">
            <Link href="/employees">
              <div className="bg-blue-500 text-white p-6 rounded-lg shadow-md hover:bg-blue-600 cursor-pointer">
                <h3 className="text-xl font-semibold">👥 Employees</h3>
                <p className="text-sm mt-2">View & manage employee records.</p>
              </div>
            </Link>
            <Link href="/expenses">
              <div className="bg-green-500 text-white p-6 rounded-lg shadow-md hover:bg-green-600 cursor-pointer">
                <h3 className="text-xl font-semibold">💰 Expense Reports</h3>
                <p className="text-sm mt-2">Review & approve reimbursement requests.</p>
              </div>
            </Link>
            <Link href="/it-support">
              <div className="bg-yellow-500 text-white p-6 rounded-lg shadow-md hover:bg-yellow-600 cursor-pointer">
                <h3 className="text-xl font-semibold">🖥️ IT Support</h3>
                <p className="text-sm mt-2">Manage help desk tickets & system health.</p>
              </div>
            </Link>
            <Link href="/performance">
              <div className="bg-purple-500 text-white p-6 rounded-lg shadow-md hover:bg-purple-600 cursor-pointer">
                <h3 className="text-xl font-semibold">📊 Performance Analytics</h3>
                <p className="text-sm mt-2">Monitor department metrics & KPIs.</p>
              </div>
            </Link>
            <Link href="/corporate">
              <div className="bg-teal-500 text-white p-6 rounded-lg shadow-md hover:bg-teal-600 cursor-pointer">
                <h3 className="text-xl font-semibold">🏢 Corporate Initiatives</h3>
                <p className="text-sm mt-2">Track ongoing company projects.</p>
              </div>
            </Link>
            <Link href="/security">
              <div className="bg-red-500 text-white p-6 rounded-lg shadow-md hover:bg-red-600 cursor-pointer">
                <h3 className="text-xl font-semibold">🔒 Security & Compliance</h3>
                <p className="text-sm mt-2">Manage access control & security audits.</p>
              </div>
            </Link>
          </div>

          {/* System Status */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold text-black">📊 System Status</h2>
            <ul className="mt-4 space-y-2">
              <li className="bg-gray-200 p-3 text-black rounded-lg">🟢 Servers: Operational</li>
              <li className="bg-gray-200 p-3 text-black rounded-lg">🟠 Internal VPN: Routing through a Chuck E. Cheese in Ohio</li>
              <li className="bg-gray-200 p-3 text-black rounded-lg">🔴 Finance Department: Actively ignoring reimbursements</li>
              <li className="bg-gray-200 p-3 text-black rounded-lg">🟢 HR Help Desk: Fully staffed (by Greg, our intern)</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
