import Sidebar from "../components/sidebar.js";
import Link from "next/link";

export default function About() {
    return (
    <div className="flex min-h-screen bg-gray-800">
        <Sidebar />
        <div className="flex-1 p-6">
            <div className="max-w-3xl mx-auto bg-gray-700 shadow-md rounded-lg p-6">
                <img src="/opossumdynamics.jpg" alt="Company Logo" className="w-24 mx-auto" />
                <h1 className="text-2xl font-bold text-white mb-4">About Opossum Dynamics</h1>
                <p className="text-gray-300">
                    At Opossum Dynamics, we believe in two things: <strong>extreme adaptability</strong> and
                    <strong> unhinged corporate enthusiasm</strong>. We pivot faster than a caffeinated intern, and we never back down from a challenge—just like our namesake, the noble opossum.
                </p>
                <br></br>
                <p className="text-gray-300 mb-4">
                Founded in a <b>garage</b>, <b>attic</b>, or <b>possibly a fast-food drive-thru</b>, Opossum Dynamics has evolved into a powerhouse of innovation.
                Our core mission? To revolutionize the way people think about *nothing in particular*, while maximizing synergy and delivering thought leadership.
                </p>

                <h2 className="text-xl font-bold text-white mt-4">Our Core Values</h2>
                <ul className="list-disc list-inside text-gray-300">
                    <li><strong>Adapt or Play Dead</strong> – We change strategies so fast even WE don’t know what's next.</li>
                    <li><strong>Commit to the Bit</strong> – If we’re doing it, we’re all in. No half-measures.</li>
                    <li><strong>Emails at 3 AM</strong> – We don’t sleep. We just regenerate.</li>
                    <li><strong>Ethics?</strong> – Yes. We have them. Probably.</li>
                </ul>

                <p className="mt-4 text-gray-400">
                    Got questions? Complaints? Existential dread? Reach out to HR (but don’t expect answers fast).
                </p>
                </div>
            </div>
        </div>
    );
}
