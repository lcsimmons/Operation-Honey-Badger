import Sidebar from "../components/sidebar.js";
import Link from "next/link";

export default function Resources() {
    return (
      <div className="flex min-h-screen bg-gray-800">
        <Sidebar />
        <div className="flex-1 p-6">
          <div className="max-w-3xl mx-auto bg-gray-700 shadow-md rounded-lg p-6">
            <h1 className="text-3xl font-bold text-white mb-4">Company Resources</h1>
            <p className="text-gray-300 mb-4">
              Whether you’re looking for documentation, IT support, or just trying to survive another day at Opossum Dynamics,
              we’ve got the resources to *probably* help you out.
            </p>

            <h2 className="text-2xl font-semibold text-white mt-6 mb-3">Essential Links</h2>
            <ul className="list-disc list-inside text-gray-300">
              <li><a href="#" className="text-blue-300 hover:underline">🚀 Employee Handbook (PDF, mostly redacted)</a></li>
              <li><a href="#" className="text-blue-300 hover:underline">💻 IT Support Ticket System (good luck)</a></li>
              <li><a href="#" className="text-blue-300 hover:underline">🏝️ PTO Request Form (Denied by default)</a></li>
              <li><a href="#" className="text-blue-300 hover:underline">💳 Expense Reimbursement (Hope you saved receipts)</a></li>
            </ul>

            <h2 className="text-2xl font-semibold text-white mt-6 mb-3">Need More Help?</h2>
            <p className="text-gray-300">
              Please contact HR or IT support. If you hear laughter on the other end, you’ve reached the right department.
            </p>
          </div>
        </div>
      </div>
    );
}
