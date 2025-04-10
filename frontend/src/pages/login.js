import { useState } from "react";
import { useRouter } from "next/router";
import { getExpenses, loginUser } from "./api/apiHelper";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [securityQuestion, setSecurityQuestion] = useState("");
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showSecurityInput, setShowSecurityInput] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetError, setResetError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const router = useRouter();

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

    const encodedUsername = btoa(username);
    const encodedPassword = btoa(password);

    try {
      const res = await loginUser({ username: encodedUsername, password: encodedPassword });

      console.log(res)

      if (res.data.success) {
        const user = res.data.username || username;

        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", user);
        localStorage.setItem("avatar", "/default.png");
        router.push("/forum");
      } else {
        setError("Invalid username or password. Please try again.");
      }
    } catch (err) {
      setError("Login failed. Please try again.");
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setResetMessage("");
    setResetError("");
    setShowSecurityInput(false);
    setShowPasswordReset(false);
  };

  const [questionId, setQuestionId] = useState(null);

  const fetchSecurityQuestion = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/security_questions", { 
        username
      });

      if (res.data && Object.keys(res.data).length > 0) {
        setSecurityQuestion(res.data.question_text);
        setQuestionId(res.data.question_id);
        setShowSecurityInput(true);
        setResetError("");
      } else {
        setResetError("No security questions found for this username.");
      }
    } catch {
      setResetError("Error retrieving security question.");
    }
    
  };


  const validateSecurityAnswer = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/forgot_password", {
        username,
        answers: [{ question_id: questionId, answer: securityAnswer }],
      });

      if (res.data.message?.includes("validated")) {
        setShowPasswordReset(true);
        setResetError("");
      } else {
        setResetError("Security answer not accepted.");
      }
    } catch (err) {
      setResetError(err.response?.data?.error || "Error validating answer.");
    }
  };


  const submitNewPassword = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/change_password", {
        username,
        newPassword,
      });
      if (res.data.message) {
        setResetMessage("Password changed successfully. You may now log in.");
        setShowForgotPassword(false);
      } else {
        setResetError("Failed to change password.");
      }
    } catch {
      setResetError("Error updating password.");
    }
  };

  return (
    <div className="flex min-h-screen">
      <title>Login · Opossum Dynamics Internal</title>
      <div className="w-3/5 flex items-center justify-center bg-black p-8">
        <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Employee Forum Login</h2>
          {alertMessage && <div className="bg-red-500 text-white p-3 rounded-lg text-center mb-4">{alertMessage}</div>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {resetError && <p className="text-red-500 text-sm text-center">{resetError}</p>}
          {resetMessage && <p className="text-green-600 text-sm text-center">{resetMessage}</p>}

          {!showForgotPassword ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" placeholder="Username" className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg" value={username} onChange={(e) => setUsername(e.target.value)} />
              <input type="password" placeholder="Password" className="w-full text-gray-800 p-3 border border-gray-300 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600">Login</button>
              <p className="text-sm text-blue-500 cursor-pointer text-center mt-2 hover:underline" onClick={handleForgotPassword}>Forgot Password?</p>
            </form>
          ) : (
            <div className="space-y-4">
              <input type="text" placeholder="Username" className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg" value={username} onChange={(e) => setUsername(e.target.value)} />
              <button onClick={fetchSecurityQuestion} className="w-full bg-gray-600 text-white p-2 rounded hover:bg-gray-700">Fetch Security Question</button>

              {showSecurityInput && (
                <>
                  <p className="text-gray-800 text-sm">{securityQuestion}</p>
                  <input type="text" placeholder="Answer" className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg" value={securityAnswer} onChange={(e) => setSecurityAnswer(e.target.value)} />
                  <button onClick={validateSecurityAnswer} className="w-full bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600">Submit</button>
                </>
              )}

              {showPasswordReset && (
                <>
                  <input type="password" placeholder="New Password" className="w-full p-3 text-gray-800 border border-gray-300 rounded-lg" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                  <button onClick={submitNewPassword} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">Reset Password</button>
                </>
              )}

              <p className="text-sm text-blue-500 cursor-pointer text-center mt-2 hover:underline" onClick={() => setShowForgotPassword(false)}>Back to Login</p>
            </div>
          )}
        </div>
      </div>
      <div className="w-2/5">
        <img src="/costco_opossum.jpg" alt="Opossum Dynamics member at work" className="w-full h-screen object-cover" />
      </div>
    </div>
  );
}