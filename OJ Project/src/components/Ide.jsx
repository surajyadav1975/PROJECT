import React, { useState } from "react";

const Ide = () => {
  const [leftTab, setLeftTab] = useState("problem");
  const [bottomTab, setBottomTab] = useState("input");

  const handleRun = () => {
    setBottomTab("output");
  };

  const handleSubmit = () => {
    setBottomTab("console");
  };

  return (
    <div className="flex h-screen text-sm font-mono bg-gray-100">
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="flex">
          <button
            onClick={() => setLeftTab("problem")}
            className={`w-1/2 p-3 text-center border-b-2 ${
              leftTab === "problem" ? "border-blue-500 font-bold" : "border-gray-200"
            }`}
          >
            Problem
          </button>
          <button
            onClick={() => setLeftTab("submission")}
            className={`w-1/2 p-3 text-center border-b-2 ${
              leftTab === "submission" ? "border-blue-500 font-bold" : "border-gray-200"
            }`}
          >
            Submissions
          </button>
        </div>

        <div className="p-4 overflow-auto flex-1">
          {leftTab === "problem" ? (
            <>
              <h2 className="text-xl font-semibold mb-2">🔢 Two Sum</h2>
              <p>
                Given an array of integers `nums` and a target integer, return indices of the two numbers such that they add up to target.
              </p>
              <pre className="mt-2 bg-gray-100 p-2 rounded">Input: nums = [2,7,11,15], target = 9{'\n'}Output: [0,1]</pre>
            </>
          ) : (
            <ul className="list-disc pl-4">
              <li>✅ Submission #1: Passed</li>
              <li>❌ Submission #2: Failed on testcase 3</li>
              <li>✅ Submission #3: Passed</li>
            </ul>
          )}
        </div>
      </div>

      <div className="w-2/3 flex flex-col">
        <textarea
          className="flex-1 p-4 bg-gray-900 text-green-200 outline-none resize-none"
        />

        <div className="flex bg-gray-800 text-white">
          {["input", "output", "console"].map((tab) => (
            <button
              key={tab}
              onClick={() => setBottomTab(tab)}
              className={`px-4 py-2 ${
                bottomTab === tab ? "bg-gray-700 font-bold" : "bg-gray-800"
              }`}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>

        <div className="bg-gray-900 text-white p-3 h-32 overflow-auto">
          {bottomTab === "input" && (
            <textarea
              placeholder="Type custom input here..."
              className="w-full h-full bg-gray-800 text-white resize-none p-2 outline-none"
            />
          )}
          {bottomTab === "output" && (
            <pre>Output will appear here...</pre>
          )}
          {bottomTab === "console" && (
            <pre>Console log will appear here...</pre>
          )}
        </div>

        <div className="flex gap-4 p-4 bg-white border-t">
          <button
            onClick={handleRun}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Run
          </button>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Ide;
