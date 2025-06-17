import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Ide = () => {
  const [leftTab, setLeftTab] = useState("problem");
  const [bottomTab, setBottomTab] = useState("input");
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [consoleMsg, setConsoleMsg] = useState("");
  const { id } = useParams();

  console.log(code);

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/problem/${id}`, {
          withCredentials: true,
        });
        setProblem(res.data.problem);
      } catch (err) {
        console.error("Error fetching problem:", err.response?.data?.message);
      }
    };
    fetchProblem();
  }, [id]);

  return (
    <div className="flex h-screen text-sm font-mono bg-gray-100">
      <div className="w-1/3 border-r bg-white flex flex-col">
        <div className="flex">
          <button
            onClick={() => setLeftTab("problem")}
            className={`w-1/2 p-3 text-center border-b-2 ${
              leftTab === "problem"
                ? "border-blue-500 font-bold"
                : "border-gray-200"
            }`}
          >
            Problem
          </button>
          <button
            onClick={() => setLeftTab("submission")}
            className={`w-1/2 p-3 text-center border-b-2 ${
              leftTab === "submission"
                ? "border-blue-500 font-bold"
                : "border-gray-200"
            }`}
          >
            Submissions
          </button>
        </div>

        <div className="p-4 overflow-auto flex-1">
          {leftTab === "problem" ? (
            <>
              <h2 className="text-xl font-semibold mb-2">{problem?.title}</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">
                {problem?.description}
              </p>

              <div className="mt-4">
                <h3 className="font-semibold mb-1">Test Cases:</h3>
                <ul className="text-xs text-gray-800">
                  {problem?.testcases
                    ?.filter((tc) => tc.visible)
                    .map((tc, idx) => (
                      <li key={idx} className="mb-2">
                        <span className="font-medium">Input:</span>{" "}
                        {tc.input} <br />
                        <span className="font-medium">Output:</span>{" "}
                        {tc.output}
                      </li>
                    ))}
                </ul>
              </div>
            </>
          ) : (
            <ul className="list-disc pl-4 text-sm">
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
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="// Write your code here..."
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
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          )}
          {bottomTab === "output" && <pre>{output}</pre>}
          {bottomTab === "console" && <pre>{consoleMsg}</pre>}
        </div>

        <div className="flex gap-4 p-4 bg-white border-t">
          <button
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Run
          </button>
          <button
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
