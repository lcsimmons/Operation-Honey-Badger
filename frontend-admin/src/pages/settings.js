import Sidebar from "../components/sidebar";

export default function Settings() {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#91d2ff] to-[#72b4ea]">
      <Sidebar />
      <div className="flex-1 text-black ml-20 transition-all duration-300">
        <div className="grid grid-cols-3 gap-6 p-6">
          {/* TopBar */}
          <div className="col-span-20 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-4 mr-4 ml-4">
            <h1 className="text-xl font-semibold">
              General Settings
            </h1>
          </div>

          {/* General Settings */}
          <div className="col-span-20 row-span-10 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            
          </div>

          {/* MidBar */}
          <div className="col-span-20 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            <h1 className="text-xl font-semibold">
              Admin Dashboard Settings
            </h1>
          </div>

          {/* Admin Dashboard Settings */}
          <div className="col-span-20 row-span-10 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            
          </div>

          {/* BottomBar */}
          <div className="col-span-20 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            <h1 className="text-xl font-semibold">
              Logs Settings
            </h1>
          </div>

          {/* Logs Settings */}
          <div className="col-span-20 row-span-10 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            
          </div>

          {/* BottomBar */}
          <div className="col-span-20 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            <h1 className="text-xl font-semibold">
              Reports Accessibility Settings
            </h1>
          </div>

          {/* Reports Settings */}
          <div className="col-span-20 row-span-10 flex items-center justify-between px-6 py-4 bg-white/40 backdrop-blur-lg shadow-md rounded-lg mt-2 mr-4 ml-4">
            
          </div>
        </div>
      </div>




    </div>





  );
}
