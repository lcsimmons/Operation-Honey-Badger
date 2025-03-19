import Sidebar from "../components/sidebar";

export default function Alerts() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#91d2ff] to-[#72b4ea]">
      <Sidebar />
      <div className="flex-1 p-6 text-black">
        <h1 className="text-2xl font-bold">Alerts</h1>
      </div>
    </div>
  );
}
