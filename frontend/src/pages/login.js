import { useState } from "react";
import { useRouter } from "next/router";
import { loginUser } from "./api/apiHelper";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState(""); 
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const router = useRouter();

  // Hardcoded credentials (for now)
  const validUsers = {
    admin: { password: "password123", avatar: "/default.png", question: "What is your favorite color?", answer: "blue" },
    employee: { password: "securepass", avatar: "/default.png", question: "What is 2+2?", answer: "4" },
    bob: { password: "1234", avatar: "/default.png", question: "What is your pet’s name?", answer: "fluffy" },
  };

  // XSS and SQL Injection Detection
  const detectInjection = (input) => {
    const xssPattern = /(<script.*?>.*?<\/script>|<svg.*?on\w+=.*?>|javascript:|<iframe.*?>)/gi;
    const sqlPattern = /('|--|;|--|\b(OR|SELECT|DROP|UNION|INSERT|DELETE|UPDATE)\b)/gi;

    // Reset alert before setting a new one
    setAlertMessage("");

    if (xssPattern.test(input)) {
      console.warn("🚨 XSS Attempt Detected:", input);
      setTimeout(() => setAlertMessage("🚨 XSS Attack Detected! 🚨"), 50);
      return true;
    }
    if (sqlPattern.test(input)) {
      console.warn("🚨 SQL Injection Attempt Detected:", input);
      setTimeout(() => setAlertMessage("🚨 SQL Injection Attempt Detected! 🚨"), 50);
      return true;
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for XSS or SQL Injection in username & password
    if (detectInjection(username) || detectInjection(password)) {
      // Stop login attempt if malicious input is detected
      return; 
    }

    // Encode credentials for future API use
    const encodedUsername = btoa(username);
    const encodedPassword = btoa(password);
    
    const res = await loginUser({username: encodedUsername, password: encodedPassword});

    console.log(res)

    if (res.data['success'] || validUsers[username] && validUsers[username].password === password) {
      const user = res.data['username'] || username
      let avatar = "/default.png"

      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("username", user);
      localStorage.setItem("avatar", avatar);


      try{
        router.push("/forum");
      }catch(err){
        console.err(err)
      }
    } else {
      setError("Invalid username or password. Please try again.");
    }

    
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setResetMessage("");
    setResetError("");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();

    if (validUsers[username] && validUsers[username].answer.toLowerCase() === securityAnswer.toLowerCase()) {
      setResetMessage(`Your password is: ${validUsers[username].password}`);
      setResetError("");
    } else {
      setResetError("Incorrect answer. Try again.");
      setResetMessage("");
    }
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setUsername("");
    setSecurityAnswer("");
    setResetMessage("");
    setResetError("");
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side with login form */}
      <div className="w-3/5 flex items-center justify-center bg-black p-8">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            Employee Forum Login
          </h2>

          {/* Alert Message for XSS & SQLi */}
          {alertMessage && (
            <div className="bg-red-500 text-white p-3 rounded-lg text-center mb-4">
              {alertMessage}
            </div>
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {!showForgotPassword ? (
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
              <p 
                className="text-sm text-blue-500 cursor-pointer text-center mt-2 hover:underline"
                onClick={handleForgotPassword}
              >
                Forgot Password?
              </p>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <h3 className="text-lg font-semibold text-center text-gray-800">
                Forgot Password
              </h3>
              <input
                type="text"
                placeholder="Username"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 text-gray-800 placeholder-gray-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              {validUsers[username] ? (
                <>
                  <p className="text-gray-800 text-sm">{validUsers[username].question}</p>
                  <input
                    type="text"
                    placeholder="Answer"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring focus:ring-blue-300 text-gray-800 placeholder-gray-500"
                    value={securityAnswer}
                    onChange={(e) => setSecurityAnswer(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600"
                  >
                    Reset Password
                  </button>
                  {resetError && <p className="text-red-500 text-sm text-center">{resetError}</p>}
                  {resetMessage && <p className="text-green-500 text-sm text-center">{resetMessage}</p>}
                  {resetMessage && (
                    <button
                      onClick={handleBackToLogin}
                      className="w-full bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 mt-4"
                    >
                      Back to Login
                    </button>
                  )}
                </>
              ) : (
                <p className="text-red-500 text-sm text-center">Invalid username.</p>
              )}
            </form>
          )}
        </div>
      </div>

      {/* Right side with Image */}
      <div className="w-2/5">
        <img 
          src="/costco_opossum.jpg" 
          alt="Opossum Dynamics member at work"
          className="w-full h-screen object-cover"
        />
      </div>
    </div>
  );
}
