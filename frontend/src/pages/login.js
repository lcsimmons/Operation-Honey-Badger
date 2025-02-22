import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  // Hardcoded credentials (for now)
  const validUsers = {
    admin: { password: "password123", avatar: "/default.png" },
    employee: { password: "securepass", avatar: "/default.png" },
    bob: { password: "1234", avatar: "/default.png" },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validUsers[username] && validUsers[username].password === password) {
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("avatar", validUsers[username].avatar); 
      router.push("/forum");
    } else {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center login-bg">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Employee Forum Login
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 text-gray-800 placeholder-gray-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 text-gray-800 placeholder-gray-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}