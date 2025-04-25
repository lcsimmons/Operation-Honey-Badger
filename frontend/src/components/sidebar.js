import Link from "next/link";
import { useRouter } from "next/router";
import { MessageSquare, Briefcase, Laptop2, Users, Sparkles, BookOpen } from "lucide-react";

export default function Sidebar({ selectedCategory }) {
  const router = useRouter();

  return (
    <aside className="w-72 bg-white shadow-lg p-6 flex flex-col min-h-screen">
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4">📌 Forum Sections</h2>
        <ul className="space-y-3">
          <li>
            <Link
               href={{ pathname: "/forum", query: { category: "All" } }}
              className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition duration-200 ${selectedCategory === "All" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              <MessageSquare className="w-5 h-5" />
              All
            </Link>
          </li>
          <li>
            <Link
              href={{ pathname: "/forum", query: { category: "HR Announcements" } }}
              className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition duration-200 ${selectedCategory === "HR Announcements" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              <Briefcase className="w-5 h-5" />
              HR Announcements
            </Link>
          </li>
          <li>
            <Link
              href={{ pathname: "/forum", query: { category: "IT Support" } }}
              className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition duration-200 ${selectedCategory === "IT Support" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              <Laptop2 className="w-5 h-5" />
              IT Support
            </Link>
          </li>
          <li>
            <Link
              href={{ pathname: "/forum", query: { category: "General Chat" } }}
              className={`flex items-center gap-3 px-4 py-2 rounded-md font-medium transition duration-200 ${selectedCategory === "General Chat" ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-200"
                }`}
            >
              <Users className="w-5 h-5" />
              General Chat
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">✨ Discover</h2>
        <ul className="space-y-3">
          <li>
            <Link href="/about" className="flex items-center gap-3 text-blue-600 hover:underline">
              <Sparkles className="w-5 h-5" />
              About Opossum Dynamics
            </Link>
          </li>
          <li>
            <Link href="/resources" className="flex items-center gap-3 text-blue-600 hover:underline">
              <BookOpen className="w-5 h-5" />
              Employee Resources
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
