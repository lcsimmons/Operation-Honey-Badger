// pages/profile.js
import Sidebar from "../components/sidebar";
import { useContext } from "react";
import { FontContext } from "../context/FontContext";
import { useTextSize } from "@/context/TextSizeContext";

export default function Profile() {
  const { useOpenDyslexic } = useContext(FontContext);
  const { textSize } = useTextSize();

  return (
    <div
      style={{ fontFamily: useOpenDyslexic ? "'OpenDyslexic', sans-serif" : "Arial, sans-serif" }}
      className={`flex min-h-screen bg-gradient-to-br from-[#91d2ff] to-[#72b4ea] ${textSize}`}
    >
      <title>Admin Profile</title>

      <Sidebar />

      <main className="flex-1 ml-20 transition-all duration-300 p-6">
        <div className="bg-white/40 backdrop-blur-md rounded-lg shadow-md p-6 max-w-xl mx-auto text-center">
          <img
            src="/honey_badger.png"
            alt="Admin Avatar"
            className="w-24 h-24 rounded-full border-4 border-white shadow-md mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">Administrator</h1>
          <p className="text-gray-600 mt-2">Security Operations Center Administrator</p>
        </div>
      </main>
    </div>
  );
}
