import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from 'react-markdown';
import { SunIcon } from '@heroicons/react/24/solid'
import Editor from "@monaco-editor/react";  

const Ide = () => {
  const [leftTab, setLeftTab] = useState("problem");
  const [bottomTab, setBottomTab] = useState("input");
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState(`#include<bits/stdc++.h>
using namespace std;

int main(){
    // Write your code here...
    return 0;
}`);
  const [input, setInput] = useState("");
  const [language, setLanguage] = useState("cpp");
  const [output, setOutput] = useState("");
  const [aiReview, setAiReview] = useState("Get Ai Hints Here...");
  const [consoleMsg, setConsoleMsg] = useState({});
  const [submissions,setSubmissions]=useState([]);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [theme, setTheme] = useState("vs-dark");

  const { id } = useParams();

  const apiurl = import.meta.env.VITE_BACKEND_URL;
  const compilerurl = import.meta.env.VITE_COMPILER_URL;

  useEffect(() => {
    const fetchProblem = async () => {
      try {
        const res = await axios.get(`${apiurl}/problem/${id}`, {
          withCredentials: true,
        });
        setProblem(res.data.problem);
      } catch (err) {
        console.error("Error fetching problem:", err.response?.data?.message);
      }
    };
    fetchProblem();
  }, [id]);

  useEffect(() => {
    const fetchSubmissions = async () => {
      if (leftTab === "submission") {
        try {
          const res = await axios.get(
            `${apiurl}/submissions/${id}`,
            { withCredentials: true }
          );
          setSubmissions(res.data.submissions);
        } catch (err) {
          console.error("Error fetching submissions:", err.response?.data?.message);
        }
      }
    };
    fetchSubmissions();
  }, [leftTab, id]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "vs-dark" ? "light" : "vs-dark"));
  };


  const handlelang =(e)=>{

    setLanguage(e.target.value);

    if(e.target.value=="cpp"){
      setCode(`#include<bits/stdc++.h>
using namespace std;

int main(){
    // Write your code here...
    return 0;
}`)
    }
    else if(e.target.value=="py"){
      setCode(`# Write your code here...
def main():
    pass

if __name__ == "__main__":
    main()`)
    }
    else if(e.target.value=="java"){
      setCode(`// Write your code here...
function main() {
    
}

main();`)
    }
    else if(e.target.value=="c"){
      setCode(`#include <stdio.h>

int main() {
    // Write your code here...
    return 0;
}`)
    }
    else if(e.target.value=="js"){
      setCode(`// Write your code here...
function main() {
    console.log("Hello, World!");
}

main();`)
    }
    else{
      setCode(`// Write your code here...`)
    }


  }
  const handlesubmit= async()=>{
    const userId = localStorage.getItem('userId');
    try{
      const data={
        code:code,
        language,
        id,
        userId,
      }
      const response=await axios.post(`${compilerurl}/submit`, data ,{
        withCredentials: true,
      });

      setConsoleMsg(response.data.results);
      setBottomTab("console");
    }
    catch(err){
      console.log('error in submitting the code');
    }
  }

  const handlerun= async()=>{
    try{
      const data={
        code:code,
        language,
        input,
      }

      const response=await axios.post(`${compilerurl}/run`, data ,{
        withCredentials: true,
      });

      setOutput(response.data.output.output);
      setBottomTab("output");
    }
    catch(err){
      if(err.response.status === 400){
        setOutput(err.response.data.message);
        setBottomTab("output");
      }
      console.log('error in running the code');
    }
  }

  const handleai =async()=>{

    const data={
      problem:problem.description,
    }
    try{
      const response=await axios.post(`${apiurl}/aihints`,data,{
        withCredentials: true,
      })

      const reviewText = response.data.review.candidates[0].content.parts[0].text;
      if (reviewText) {
        setAiReview(reviewText);
      } else {
        setAiReview("Some error ocurred, By the way You shouldn't be using AI it's Bad Practice");
      }

      setBottomTab("AI");
    }
    catch(err){
      console.log('error in getting hints',err);
    }
  }
  


  return (
    <div className="flex h-screen text-sm font-serif bg-gray-100">

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
              {submissions.length === 0 ? (
                <li className="text-gray-500">No submissions yet.</li>
              ): (submissions?.map((item,index)=>(
                  <div
                    key={index}
                    onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    className={`p-4 mb-4 rounded-lg shadow-md cursor-pointer transition-transform transform hover:scale-[1.01] ${
                      item.verdict === "Accepted"
                        ? "bg-green-50 border-l-4 border-green-500"
                        : "bg-red-50 border-l-4 border-red-500"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <h3 className="font-semibold text-gray-800">
                        {item.verdict === "Accepted" ? "✅" : "❌"} Submission #{index + 1}
                      </h3>
                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${
                          item.verdict === "Accepted"
                            ? "bg-green-200 text-green-800"
                            : "bg-red-200 text-red-800"
                        }`}
                      >
                        {item.verdict}
                      </span>
                    </div>

                    <div className="text-xs text-gray-600">
                      <span className="mr-4">🕒 {new Date(item.submittedAt).toLocaleString()}</span>
                    </div>

                    {expandedIndex === index && (
                      <div className="mt-4">
                        <h4 className="font-semibold text-gray-800 mb-1">Submitted Code:</h4>
                        <pre className="bg-gray-900 text-green-200 p-3 rounded text-sm overflow-auto max-h-60 whitespace-pre-wrap">
                          {item.code}
                        </pre>
                      </div>
                    )}
                  </div>
                )))
              }
            </ul>
          )}
        </div>
      </div>

      <div className="w-2/3 flex flex-col">

        <div className="flex justify-between gap-4 p-4 bg-white">
          <select 
            onChange={handlelang}
            className="border border-gray-300 px-4 py-2 rounded focus:ring-2 focus:ring-yellow-500">
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="py">Python</option>
            <option value="js">JavaScript</option>
          </select>
          <div className="flex gap-4">
            <button
            className="bg-sky-500 shadow-xl/20 text-white px-4 py-2 rounded hover:bg-sky-600"
            onClick={handleai}
          >
            Get AI Hint's
          </button>
            <button
            className="bg-yellow-500 shadow-xl/20 text-white px-4 py-2 rounded hover:bg-yellow-600"
            onClick={handlerun}
          >
            Run
          </button>
          <button
            className="bg-green-500 shadow-xl/20 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handlesubmit}
          >
            Submit
          </button>
          <button
            className={`shadow-xl/20 border px-1 rounded cursor-pointer transition-colors duration-100 ${
              theme === "vs-dark" ? "bg-white hover:bg-gray-400" : "bg-black hover:bg-gray-600"
            }`}
            onClick={toggleTheme}
          >
            <SunIcon className={`h-6 w-6 transition-colors duration-100 ${theme === "vs-dark" ? "text-black" : "text-white"}`} />
          </button>
          
          </div>
        </div>

        <Editor
          height="70vh"
          width="100%"
          language={language === "py" ? "python" : language === "js" ? "javascript" : language}
          theme={theme}
          value={code}
          onChange={(value) => {
            setCode(value);
          }}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            fontFamily: 'Fira Code, monospace',
            automaticLayout: true,
          }}
        />

        <div className="flex bg-gray-800 text-white">
          {["input", "output", "console", "AI"].map((tab) => (
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
          {bottomTab === "output" && <div>
            <span className="capitalize">{output}</span>
          </div>}
          {bottomTab === "console" && <div>
            {Object.entries(consoleMsg).map(([key, verdict], index) => (
                <div
                  key={index}
                  className={`m-1 p-2 w-1/2 ${
                    (verdict === "accepted")
                      ? "bg-green-100 text-green-900"
                      : (verdict === "rejected")
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  <span className="capitalize">{key}: {verdict}</span>
                </div>
            ))}
            </div>}
          {bottomTab === "AI" && <div className="p-2 rounded-sm max-w-none bg-white font-sans text-gray-700">
              <ReactMarkdown>{aiReview}</ReactMarkdown>
            </div>}
        </div>
      </div>
    </div>
  );
};

export default Ide;
