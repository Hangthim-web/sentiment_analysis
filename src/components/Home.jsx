import React, { useState } from "react";
import CustomPieChart from "./CustomPieChart.jsx";
import LoadingOverlay from "./LoadingOverlay";
import { Link, useNavigate } from "react-router-dom";
import Modal from "./Modal"; // Import your modal component if you have one
// import "./App.css"; // Import additional styles if needed

import { isTokenExpired } from "../utils/auth.jsx";

const Home = () => {
  const [userInput, setUserInput] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showHateSpeechDialog, setShowHateSpeechDialog] = useState(false);

  const navigate = useNavigate();

    const getUserToken = () => {
      
      return localStorage.getItem("access");
    };

      const logout = () => {
      
        localStorage.removeItem("access");
        navigate("/login");
        
      };

       const csrfCookie = document.cookie
         .split("; ")
         .find((row) => row.startsWith("csrftoken="));

       const csrftoken = csrfCookie && csrfCookie.split("=")[1];


  const analyzeSentiment = async (url) => {
    try {
      const AccessToken = getUserToken();
      console.log("Access Token in analyzeSentiment:", AccessToken);
      setIsLoading(true);
      if (isTokenExpired(AccessToken)) {
        
        console.log("Token has expired.");
        
      }
      else
      {
      
      console.log("Token is not expired")
      }

      if (!userInput.trim()) {
        throw new Error(
          "Input field is empty. Please enter text for sentiment analysis."
        );
      }
      if (userInput.trim().split(/\s+/).length > 200) {
        throw new Error("Input should not exceed 200 words.");
      }

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AccessToken}`,
          "X-CSRFToken": csrftoken,
        },
        credentials: "include",
        body: JSON.stringify({ user_input: userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const resultData = await response.json();
      setResults({ [url]: resultData });

      
      if (
        resultData.predicted_sentiment === "Negative" &&
        resultData.probability_negative > 0.65
      ) {
        setShowHateSpeechDialog(true);
      }
    } catch (error) {
      setError(error.message);
      console.error("Error during sentiment analysis:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleLogout = async () => {
    try {
      setIsLoading(true);

      
      const AccessToken = getUserToken(); 

      const response = await fetch("http://127.0.0.1:8000/api/logout/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${AccessToken}`, 
        },
        credentials: "include",
       
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      logout(); 
    } catch (error) {
      setError("Logout failed. Please try again.");
      console.error("Error during logout:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeHateSpeechDialog = () => {
    setShowHateSpeechDialog(false);
  };

  const getSentimentColorClass = (sentiment) => {
    if (sentiment === "Negative") {
      return "bg-red-600 text-white";
    } else if (sentiment === "Positive") {
      return "bg-green-500 text-white";
    } else if (sentiment === "Neutral") {
      return "bg-yellow-500 text-black";
    }
    return "";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-800 via-gray-700 to-gray-900 text-white">
      <div className="flex justify-between items-center ">
        <div className="mr-[1100px]">
          <h1 className="font-bold text-2xl cursor-pointer read-only">HSD</h1>
        </div>
        <div>
          <ul>
            <Link
              to="/home"
              className="text-md mr-[22px] hover:underline underline-offset-8 transition ease-in-out delay-100"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="text-md mr-[22px] hover:underline underline-offset-8 transition ease-in-out delay-100"
            >
              About
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md mt-4 hover:bg-red-600 transition ease-in-out delay-50"
              
            >
              Logout
            </button>
          </ul>
        </div>
      </div>

      {showHateSpeechDialog && (
        <Modal onClose={closeHateSpeechDialog}>
          <div className="p-4 bg-white rounded-md">
            <p className="text-red-600 font-semibold">
              Warning: Hate Speech Detected!
            </p>
            <p className="mt-2 text-red-600">
              The analyzed text has been detected as hate speech.
            </p>
            <button
              onClick={closeHateSpeechDialog}
              className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </Modal>
      )}

      {isLoading && <LoadingOverlay />}
      <div className="text-white-color text-center p-8">
        <h1 className="text-3xl font-bold mb-4 text-[#fff]">
          <span className="bg-[#ffffff] text-[#232323] p-1 rounded-md">
            Hate Speech Detection
          </span>{" "}
          Using Sentiment Analysis
        </h1>
        <p className="text-lg text-[#fff]">
          The Evolution of Hate Speech Detection: Navigating Challenges and
          Embracing Progress
        </p>
      </div>

      <div className="flex-grow w-full max-w-screen-lg p-8 bg-gray-900 rounded-lg shadow-md">
        <div className="mb-4 md:mb-0 md:mr-4 w-full md:w-1/2 flex-grow">
          <label
            htmlFor="userInput"
            className="block mb-2 text-lg font-semibold text-[#fff] mr-[320px]"
          >
            Enter the text here:
          </label>
          <textarea
            id="userInput"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="w-full h-40 p-2 border border-gray-300 rounded-md  focus:border-black-300 text-[#232323]"
            placeholder="Enter text for sentiment analysis (max 200 words)"
          />
          <div className="flex space-x-4 mt-4">
            <div>
              <h1 className="font-bold text-center">BOW</h1>

              <button
                className="bg-[#fff] text-[#232323] font-semibold px-4 py-1 rounded-md mb-2 min-w-[150px]"
                onClick={() =>
                  analyzeSentiment(
                    "http://127.0.0.1:8000/api/sentiment_bow_naive/"
                  )
                }
              >
                BoW_naive
              </button>
              <br />
              <button
                onClick={() =>
                  analyzeSentiment(
                    "http://127.0.0.1:8000/api/sentiment_bow_logistic/"
                  )
                }
                className="bg-[#fff] text-[#232323] font-semibold px-4 py-1 rounded-md mb-2 min-w-[150px]"
              >
                BoW_logistic
              </button>
              <br />
              <button
                onClick={() =>
                  analyzeSentiment(
                    "http://127.0.0.1:8000/api/sentiment_bow_random/"
                  )
                }
                className="bg-[#fff] text-[#232323] font-semibold px-4 py-1 rounded-md mb-2 min-w-[150px]"
              >
                BoW_random
              </button>
              <br />
              <button
                onClick={() =>
                  analyzeSentiment(
                    "http://127.0.0.1:8000/api/sentiment_bow_svm/"
                  )
                }
                className="bg-[#fff] text-[#232323] font-semibold px-4 py-1 rounded-md mb-2 min-w-[150px]"
              >
                BoW_svm
              </button>
              <br />
            </div>
            <div>
              <h1 className="font-bold text-center">TF_IDF</h1>
              <button
                onClick={() =>
                  analyzeSentiment(
                    "http://127.0.0.1:8000/api/sentiment_tfidf_naive/"
                  )
                }
                className="bg-[#fff] text-[#232323] font-semibold px-4 py-1 rounded-md mb-2 min-w-[150px]"
              >
                TF-IDF_naive
              </button>
              <br />
              <button
                onClick={() =>
                  analyzeSentiment(
                    "http://127.0.0.1:8000/api/sentiment_tfidf_logistic/"
                  )
                }
                className="bg-[#fff] text-[#232323] font-semibold px-4 py-1 rounded-md mb-2 min-w-[150px]"
              >
                TF-IDF_logistic
              </button>
              <br />
              <button
                onClick={() =>
                  analyzeSentiment(
                    "http://127.0.0.1:8000/api/sentiment_tfidf_random/"
                  )
                }
                className="bg-[#fff] text-[#232323] font-semibold px-4 py-1 rounded-md mb-2 min-w-[150px]"
              >
                TF-IDF_random
              </button>
              <br />
              <button
                onClick={() =>
                  analyzeSentiment(
                    "http://127.0.0.1:8000/api/sentiment_tfidf_svm/"
                  )
                }
                className="bg-[#fff] text-[#232323] font-semibold px-4 py-1 rounded-md mb-2 min-w-[150px]"
              >
                TF-IDF_svm
              </button>
            </div>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
      </div>

      {results && (
        <div className="w-[full] md:w-3/4 mt-4">
          {Object.keys(results).map((algorithm) => (
            <div
              key={algorithm}
              className="mb-8 bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <p
                className={`text-xl p-2 rounded-sm font-semibold ${getSentimentColorClass(
                  results[algorithm].predicted_sentiment
                )}`}
              >
                {algorithm
                  .replace(/^.*\/sentiment_/, "")
                  .replace(/^.*\/myapp\//, "")
                  .toUpperCase()}{" "}
                Results:
              </p>
              <p className="mb-4 text-gray-800 mt-2 rounded-sm">
                Predicted Sentiment:{" "}
                <span className="font-bold text-xl tracking-[1px]">
                  {results[algorithm].predicted_sentiment}
                </span>
              </p>
              <div className="flex space-x-4 mb-4 text-[#232323]">
                <p className="flex-1 bg-[#dc3545] p-[6px] rounded-sm">
                  Negative:{" "}
                  <span className="font-semibold">
                    {results[algorithm].probability_negative.toFixed(4) * 100}%
                  </span>
                </p>
                <p className="flex-1 bg-[#adadc9] p-[6px] rounded-sm">
                  Neutral:{" "}
                  <span className="font-semibold">
                    {results[algorithm].probability_neutral?.toFixed(4) * 100}%
                  </span>
                </p>
                <p className="flex-1 bg-[#03ac13] p-[6px] rounded-sm">
                  Positive:{" "}
                  <span className="font-semibold">
                    {results[algorithm].probability_positive?.toFixed(4) * 100}%
                  </span>
                </p>
              </div>
              <div className="grid">
                <div className="mb-4 md:mb-0">
                  <p className="text-xl font-semibold text-gray-800">
                    Classification Report:
                  </p>
                  <table className="w-full mt-2 text-[#232323]">
                    <thead className="bg-slate-800 text-[#fff]">
                      <tr>
                        <th className="border px-4 py-2">Class</th>
                        <th className="border px-4 py-2">Precision</th>
                        <th className="border px-4 py-2">Recall</th>
                        <th className="border px-4 py-2">F1-Score</th>
                        <th className="border px-4 py-2">Support</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(
                        results[algorithm].classification_report
                      ).map(([className, metrics]) => (
                        <tr key={className}>
                          <td className="border px-4 py-2">{className}</td>
                          <td className="border px-4 py-2">
                            {metrics.precision?.toFixed(2) || "N/A"}
                          </td>
                          <td className="border px-4 py-2">
                            {metrics.recall?.toFixed(2) || "N/A"}
                          </td>
                          <td className="border px-4 py-2">
                            {metrics["f1-score"]?.toFixed(2) || "N/A"}
                          </td>
                          <td className="border px-4 py-2">
                            {metrics.support || "N/A"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-lg font-semibold mb-2 text-gray-800 mt-5">
                  Overall Accuracy:{" "}
                  {results[algorithm].overall_accuracy?.toFixed(2)}%
                </p>
                <div className="flex flex-col">
                  <CustomPieChart
                    data={[
                      {
                        name: "Negative",
                        value: parseFloat(
                          results[algorithm].probability_negative?.toFixed(4)
                        ),
                      },
                      {
                        name: "Neutral",
                        value: parseFloat(
                          results[algorithm].probability_neutral.toFixed(4)
                        ),
                      },
                      {
                        name: "Positive",
                        value: parseFloat(
                          results[algorithm].probability_positive.toFixed(4)
                        ),
                      },
                    ]}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
