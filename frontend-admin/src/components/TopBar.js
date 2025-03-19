const TopBar = () => {
    return (
      <div className="bg-white shadow-md py-4 px-6 flex justify-between items-center fixed top-0 left-0 right-0 z-50">
        <h1 className="text-xl font-bold text-gray-900">Operation Honey Badger: Admin Dashboard</h1>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };
  
  export default TopBar;
  