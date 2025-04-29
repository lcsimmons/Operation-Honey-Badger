import Sidebar from "../components/sidebar.js";
import Search from "../components/Search";
import { ShieldCheck, MapPin, Brain, Landmark, RefreshCcw, BarChart, Squirrel, Bell, Info, Wrench, LogOut } from "lucide-react";
import { useRouter } from "next/router"; 

export default function About() {
    const router = useRouter(); 
    const handleLogout = () => {
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("username");
        localStorage.removeItem("avatar");
      
        try {
          router.push("/login");
        } catch (err) {
          console.error("Logout redirect failed:", err);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-gray-900 to-blue-900 p-4 text-white flex items-center">
                <div className="flex items-center flex-1 gap-x-10">
                    <h1 className="text-xl font-bold flex-shrink-0">Co.</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={handleLogout}>
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex flex-1">
                <Sidebar />

                {/* Main Content */}
                <div className="flex-1 p-10 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <img src="/opossumdynamics.jpg" alt="Company Logo" className="w-32 mx-auto rounded-lg shadow-md border border-gray-200" />
                        <h1 className="text-5xl font-extrabold text-gray-900 mt-6 tracking-wide">
                            Opossum Dynamics
                        </h1>
                        <h2 className="text-lg text-gray-500 italic font-light mt-2">
                            Innovation, Distraction, Opossum Action™
                        </h2>
                    </div>

                    {/* About Section */}
                    <div className="space-y-10">
                        <p className="text-gray-700 leading-relaxed text-lg text-center">
                            Opossum Dynamics is a multi-disciplinary technology firm specializing in "solutions" that often create as many problems as they solve.
                            Some say we disrupt industries. Others say we just cause problems in new and exciting ways. Both are technically correct.
                        </p>

                        {/* What We Do */}
                        <div className="border-t border-gray-300 pt-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Do</h2>
                            <ul className="space-y-6">
                                <li className="flex items-start space-x-4">
                                    <ShieldCheck className="w-8 h-8 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">Cybersecurity Stress Testing</p>
                                        <p className="text-gray-600">We don’t defend your network. We attack it first so you know what to be afraid of.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-4">
                                    <MapPin className="w-8 h-8 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">"Agile" Urban Operations</p>
                                        <p className="text-gray-600">We embed field teams into real-world environments to "assess vulnerabilities" (a.k.a. see what breaks when we push buttons).</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-4">
                                    <Brain className="w-8 h-8 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">AI-Powered Consulting</p>
                                        <p className="text-gray-600">Our AI-generated reports are as insightful as they are legally dubious.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-4">
                                    <Landmark className="w-8 h-8 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">"Infrastructure Resilience Audits"</p>
                                        <p className="text-gray-600">We attempt highly unauthorized physical penetration tests (i.e., we walk into buildings and see how far we get).</p>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* Company Values */}
                        <div className="border-t border-gray-300 pt-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Company Values</h2>
                            <ul className="space-y-6">
                                <li className="flex items-start space-x-4">
                                    <RefreshCcw className="w-8 h-8 text-green-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">Adaptability</p>
                                        <p className="text-gray-600">Every great business pivots. Sometimes six times a quarter.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-4">
                                    <BarChart className="w-8 h-8 text-green-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">Pragmatism</p>
                                        <p className="text-gray-600">We get results. Sometimes not the ones you wanted, but still.</p>
                                    </div>
                                </li>
                                <li className="flex items-start space-x-4">
                                    <Squirrel className="w-8 h-8 text-green-600 flex-shrink-0" />
                                    <div>
                                        <p className="text-lg font-semibold text-gray-800">Persistence</p>
                                        <p className="text-gray-600">Like an opossum in your attic, we refuse to leave.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Footer Message */}
                    <div className="mt-12 text-center text-gray-600 text-lg font-semibold">
                        Opossum Dynamics: Fixing Problems We Definitely Didn’t Cause™.
                    </div>
                </div>
            </div>
        </div>
    );
}
