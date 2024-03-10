// Import statements...
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay";
import { Link } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, isLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    isLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Save tokens in local storage
        localStorage.setItem("access", data.access);
        localStorage.setItem("refresh", data.refresh);

        console.log("Login successful");
        console.log("Access Token:", data.access);
        console.log("Refresh Token:", data.refresh);

        
        navigate("/home");
      } else {
        
        setErrorMessage("Invalid username or password");
      }
    } catch (error) {
      console.error("Error during login:", error);
    } finally {
      isLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="  bg-gray-100 min-h-screen">

      {loading && <LoadingOverlay />}
    <div className="container mx-auto max-w-md  p-10 rounded-md shadow-lg bg-white">

      
      <div>


      <h2 className="text-3xl font-bold mb-4 text-center text-blue-600">
        Login
      </h2>
      <form>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-600"
            >
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300"
            />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600"
            >
            Password:
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border rounded focus:outline-none focus:ring focus:border-blue-300"
              />
            <span
              onClick={toggleShowPassword}
              className="absolute right-2 top-3 cursor-pointer"
              >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-300"
          >
          Login
        </button>
        <p className="mt-4">
          Not registered yet?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
      {/* Display error message if login fails */}
            </div>
      {errorMessage && (
        <p className="text-red-500 mt-2 text-center">{errorMessage}</p>
        )}
    </div>
        </div>
  );
}

export default Login;
