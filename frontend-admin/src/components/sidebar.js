import { useState, useRef } from "react";
import Link from "next/link";
import { Home, List, Clipboard, AlertTriangle, Settings, User, LogOut } from "lucide-react";

const Sidebar = () => {
  const [expanded, setExpanded] = useState(false);
  const manualExpand = useRef(false); 

  const handleMouseEnter = () => {
    if (!manualExpand.current) {
      setExpanded(true);
    }
  };

  const handleMouseLeave = () => {
    if (!manualExpand.current) {
      setExpanded(false);
    }
  };

  const handleClick = () => {
    setExpanded(true); // Keep it expanded when clicking
    manualExpand.current = true; // Remember expansion state across pages
  };

  return (
    <div
      className={`fixed top-0 left-0 bg-white/20 h-screen transition-all duration-300 z-50 ${
        expanded ? "w-60 bg-white/20 backdrop-blur-lg shadow-lg border-r border-white/10 rounded-r-2xl" : "w-20 bg-transparent"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative flex flex-col h-full text-black p-4">
        {/* Logo */}
        <div className="w-12 h-12 flex items-center justify-center mx-auto flex-shrink-0">
          <img src="/honey_badger.png" className="w-full h-full object-contain" alt="Honey Badger Logo" />
        </div>
      <br></br>

        {/* Navigation */}
        <nav className="space-y-10">
          <SidebarLink href="/" icon={<Home size={24} />} text="Dashboard" expanded={expanded} onClick={handleClick} />
          <SidebarLink href="/logs" icon={<List size={24} />} text="Logs" expanded={expanded} onClick={handleClick} />
          <SidebarLink href="/reports" icon={<Clipboard size={24} />} text="Reports" expanded={expanded} onClick={handleClick} />
          {/* <SidebarLink href="/alerts" icon={<AlertTriangle size={24} />} text="Alerts" expanded={expanded} onClick={handleClick} /> */}
          <SidebarLink href="/settings" icon={<Settings size={24} />} text="Settings" expanded={expanded} onClick={handleClick} />
        </nav>

        {/* Bottom Section */}
        <div className="mt-auto">
          <SidebarLink href="/profile" icon={<User size={24} />} text="Admin" expanded={expanded} onClick={handleClick} />
          <SidebarLink href="/logout" icon={<LogOut size={24} />} text="Logout" expanded={expanded} textColor="text-red-500 hover:text-red-700" onClick={handleClick} />
        </div>
      </div>
    </div>
  );
};

const SidebarLink = ({ href, icon, text, expanded, textColor = "text-black hover:text-blue-500", onClick }) => (
  <Link href={href} onClick={onClick}>
    <div className={`flex items-center gap-4 cursor-pointer ${textColor} py-3`}>
      {icon}
      {expanded && <span>{text}</span>}
    </div>
  </Link>
);

export default Sidebar;
