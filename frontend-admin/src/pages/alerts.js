import Sidebar from "../components/sidebar";
import { useContext } from 'react'; import { FontContext } from '../context/FontContext';
import { LanguageContext } from '@/context/LanguageContext';

export default function Alerts() {
  const { useOpenDyslexic } = useContext(FontContext);
  return (
    <div 
    style={{ fontFamily: useOpenDyslexic ? "'OpenDyslexic', sans-serif" : "Arial, sans-serif" }} 
    className="flex min-h-screen bg-gradient-to-br from-[#91d2ff] to-[#72b4ea]">
      <Sidebar />
      <div className="flex-1 p-6 text-black">
        <h1 className="text-2xl font-bold">Alerts</h1>
      </div>
    </div>
  );
}
