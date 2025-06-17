import React from "react";
import { useNavigate } from "react-router-dom";

const sampleProblems = [
  {
    id: "1",
    title: "Two Sum in Array",
    tag: "Array Hashing Set Map",
    difficulty: "Easy",
  },
  {
    id: "2",
    title: "Valid Parentheses",
    tag: "Stack Array String",
    difficulty: "Easy",
  },
  {
    id: "3",
    title: "Longest Subsequence",
    tag: "HashMap DP Recursion",
    difficulty: "Medium",
  },
];

const Firstpage = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-gray-800">
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Master Coding. Conquer Challenges.
        </h1>
        <p className="text-lg md:text-xl mb-8">
          Solve real-world problems, test your skills, and grow as a developer.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/problemlist")}
            className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Explore Problems
          </button>
        </div>
      </section>

      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-10">Why Choose Our Platform?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            ["🧠", "Practice problems of all levels."],
            ["💻", "Code in-browser with our powerful IDE."],
            ["📊", "Track submissions & get instant feedback."],
          ].map(([emoji, text], idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="text-4xl mb-4">{emoji}</div>
              <p className="text-lg font-medium">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-100">
        <h2 className="text-3xl font-bold mb-10 text-center">Sample Problems</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sampleProblems.map((prob) => (
            <div
              key={prob.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/problem/${prob.id}`)}
            >
              <h3 className="text-xl font-bold mb-2">{prob.title}</h3>
              <p className="text-sm text-gray-600">Tag: {prob.tag}</p>
              <p className="text-sm text-gray-600">Difficulty: {prob.difficulty}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="py-16 px-6 bg-white text-center">
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto text-left">
          {[
            ["1️⃣", "Sign Up & Choose a Problem"],
            ["2️⃣", "Write Code in our Online IDE"],
            ["3️⃣", "Submit and Get Instant Verdict"],
          ].map(([emoji, step], idx) => (
            <div
              key={idx}
              className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-md transition"
            >
              <div className="text-4xl mb-2">{emoji}</div>
              <p className="text-lg font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p className="text-sm">© {new Date().getFullYear()} OJ Platform by Suraj Yadav. All rights reserved.</p>
        <div className="mt-2">
          <a href="https://github.com/surajyadav1975" className="underline mr-4" target="_blank" rel="noopener noreferrer">
            GitHub
          </a>
          <a href="https://www.linkedin.com/in/suraj-yadav-3449a62ab/" className="underline" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Firstpage;
