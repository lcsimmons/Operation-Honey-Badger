import Sidebar from "../components/sidebar.js";
import Search from "../components/Search";
import { Book, Laptop2, Plane, CreditCard, ShieldCheck, Phone, HelpCircle, Ban, Bell, Info, Wrench } from "lucide-react";

export default function Resources() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-blue-900 p-4 text-white flex items-center">
        <div className="flex items-center flex-1 gap-x-10">
          <h1 className="text-xl font-bold flex-shrink-0">Co.</h1>
          <div className="max-w-lg w-full">
            <Search />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button>
            <Info className="w-5 h-5" />
          </button>
          <button>
            <Wrench className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 p-10 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-extrabold text-gray-900 tracking-wide">
              Employee Resources
            </h1>
            <h2 className="text-lg text-gray-500 italic font-light mt-2">
              Welcome to the Opossum Dynamics Survival Guide
            </h2>
          </div>

          {/* Overview */}
          <p className="text-gray-700 leading-relaxed text-lg text-center mb-8">
            If you’re here, you probably need help. We can’t guarantee you’ll find it, but we’ll try.
            This page contains everything you need to navigate corporate life at Opossum Dynamics—
            from essential company policies to IT support and the existential realization that no one reads the handbook.
          </p>

          {/* Essential Links */}
          <div className="border-t border-gray-300 mt-10 pt-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Essential Links</h2>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <Book className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">Employee Handbook</p>
                  <p className="text-gray-600">Last updated… probably recently. Contains legally binding rules you will definitely follow.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <Laptop2 className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">IT Support Portal</p>
                  <p className="text-gray-600">Service requests typically disappear into the void within 3-5 business days.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <Plane className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">PTO Request Form</p>
                  <p className="text-gray-600">Please submit your request 6-12 years in advance for processing.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <CreditCard className="w-8 h-8 text-blue-600 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">Expense Reimbursement</p>
                  <p className="text-gray-600">Receipts required. Just don’t ask where the reimbursement funds come from.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Internal Policies */}
          <div className="border-t border-gray-300 mt-12 pt-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Internal Policies</h2>
            <ul className="space-y-6">
              <li className="flex items-start space-x-4">
                <ShieldCheck className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">Security Guidelines</p>
                  <p className="text-gray-600">Includes critical rules like "Don't let strangers in" and "Change your password when threatened."</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <Ban className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">Incident Handling</p>
                  <p className="text-gray-600">If a security breach occurs, refer to our Deny Everything™ protocol.</p>
                </div>
              </li>
              <li className="flex items-start space-x-4">
                <Phone className="w-8 h-8 text-green-600 flex-shrink-0" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">Emergency Contacts</p>
                  <p className="text-gray-600">All emergency calls are redirected to Greg, our IT guy. Good luck.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Need More Help? */}
          <div className="border-t border-gray-300 mt-12 pt-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Need More Help?</h2>
            <div className="flex items-start space-x-4">
              <HelpCircle className="w-8 h-8 text-red-500 flex-shrink-0" />
              <p className="text-gray-700 text-lg">
                Contact HR or IT support. If you hear laughter on the other end, you’ve reached the right department.
              </p>
            </div>
          </div>

          {/* Footer Message */}
          <div className="mt-12 text-center text-gray-600 text-lg font-semibold">
            Opossum Dynamics: Surviving the Workplace, One PDF at a Time™.
          </div>
        </div>
      </div>
    </div>
  );
}
