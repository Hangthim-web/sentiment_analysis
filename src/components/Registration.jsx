import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay";

function Registration() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, isLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isEmailValid = (email) => {
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegistration = async () => {
    
    if (!username || !email || !password || !confirmPassword) {
      setErrorMessage("Please fill in all required fields.");
      return;
    } else if (!isEmailValid(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    } else if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    } else {
      setErrorMessage(""); 
    }

    
    isLoading(true);

    try {
      
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          address,
          gender,
        }),
      });

      const responseData = await response.json();

      if (response.ok) {
        
        console.log("Registration successful");
        setRegistrationSuccess(true);
        navigate("/login");
      } else {
        
        setErrorMessage(responseData.detail || "The");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setErrorMessage("An unexpected error occurred. Please try again.");
    } finally {
      
      isLoading(false);
    }
  };


  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      {loading && <LoadingOverlay />}
      <div className="w-full max-w-md bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-blue-700">Registration</h2>
        <form className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-gray-600">
              Username :
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-gray-600">
              Email :
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-gray-600">
              Password :
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
              />
              <span
                onClick={toggleShowPassword}
                className="absolute right-2 top-3 cursor-pointer"
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-600">
              Confirm Password :
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 p-2 w-full border rounded"
              />
              <span
                onClick={toggleShowConfirmPassword}
                className="absolute right-2 top-3 cursor-pointer"
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="address" className="block text-gray-600">
              Address :
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            />
          </div>
          <div>
            <label htmlFor="gender" className="block text-gray-600">
              Gender :
            </label>
            <select
              id="gender"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="mt-1 p-2 w-full border rounded"
            >
              <option value="">Select option</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
          <button
            type="button"
            onClick={handleRegistration}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className=" bg-red-500 hover:bg-red-900 text-white px-[5px] ml-[2px] py-[4px] rounded-sm transition delay-50 ease-in-out"
          >
            Login here
          </Link>
          .
        </p>
        {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
        {registrationSuccess && (
          <p className="mt-2 text-green-500">
            Registration successful! Redirecting to login page...
          </p>
        )}
      </div>
    </div>
  );
}

export default Registration;
