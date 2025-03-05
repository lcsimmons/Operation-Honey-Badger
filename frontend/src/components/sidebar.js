import Link from "next/link";
import { useRouter } from "next/router";

export default function Sidebar({ selectedCategory }) {
  const router = useRouter();

  return (
    <aside className="w-64 bg-white shadow-md p-4">
      <h2 className="text-xl font-bold text-black mb-4">Forum Sections</h2>
      <ul className="space-y-3">
        {["All", "HR Announcements", "IT Support", "General Chat"].map((category) => (
          <li key={category}>
            <Link
              href={{
                pathname: "/forum",
                query: { category: category }, 
              }}
              className={`block w-full text-left p-2 text-black rounded-md font-medium ${
                selectedCategory === category ? "bg-blue-300 text-black" : "hover:bg-white text-gray-900"
              }`}
            >
              {category === "IT Support" ? "💻" : category === "General Chat" ? "👥" : "📌"} {category}
            </Link>
          </li>
        ))}
      </ul>

      {/* Additional Links */}
      <div className="mt-6 border-t pt-4">
        <h2 className="text-lg font-bold text-gray-200 mb-2">Company Links</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/about" className="text-blue-400 hover:underline">
              About Opossum Dynamics 🧐
            </Link>
          </li>
          <li>
            <Link href="/resources" className="text-blue-400 hover:underline">
              Employee Resources 📚
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
