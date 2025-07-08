import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
// import codingImage from "../assets/coding-illustration.svg"; // Add your hero image here

const sampleProblems = [
  { id: "1", title: "Two Sum ll", tag: "Array, Hashing, Math", difficulty: "Easy" },
  { id: "2", title: "Valid Parentheses", tag: "Stack, Array, String", difficulty: "Medium" },
  { id: "3", title: "Longest Subsequence", tag: "HashMap, DP, Recursion", difficulty: "Medium" },
];

const stats = [
  ["💻", "500+", "Problems"],
  ["🚀", "100+", "Active Users"],
  ["✅", "10,000+", "Submissions Processed"],
];

const Firstpage = () => {
  const navigate = useNavigate();

  return (
    <div className="font-serif text-gray-800">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20 px-6 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Master Coding. Conquer Challenges.</h1>
        <p className="text-lg md:text-xl mb-8">Solve real-world problems, test your skills, and grow as a developer.</p>

        {/* <img src={codingImage} alt="Coding Illustration" className="max-w-md mx-auto mb-8 animate-fadeIn" /> */}

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl/30 px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
          >
            Get Started
          </button>
          <button
            onClick={() => navigate("/problemlist")}
            className="bg-yellow-400 text-black px-6 py-3 shadow-xl/30 rounded-lg font-semibold hover:bg-yellow-300 transition"
          >
            Explore Problems
          </button>
        </div>
      </motion.section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 bg-gradient-to-r from-indigo-50 to-purple-100 text-center"
      >
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Why Use This Platform?</h2>
        <p className="text-lg max-w-3xl mx-auto text-gray-700 mb-4">
          This isn't just another online judge. It's a platform designed to help you practice, grow, and master coding with a real compiler experience, instant feedback, and a clean, responsive interface.
        </p>
      </motion.section>

      {/* Features Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 bg-white text-center"
      >
        <h2 className="text-3xl font-bold mb-10">Why Choose Our Platform?</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            ["🧠", "Practice problems of all levels."],
            ["💻", "Code in-browser with our powerful IDE."],
            ["📊", "Track submissions & get instant feedback."],
          ].map(([emoji, text], idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md transition hover:scale-105">
              <div className="text-4xl mb-4">{emoji}</div>
              <p className="text-lg font-medium">{text}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Sample Problems */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 bg-gray-100"
      >
        <h2 className="text-3xl font-bold mb-10 text-center">Sample Problems</h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {sampleProblems.map((prob) => (
            <div
              key={prob.id}
              className="bg-white p-6 rounded-lg shadow hover:shadow-xl hover:scale-105 transition-transform cursor-pointer"
              onClick={() => navigate(`/problem/${prob.id}`)}
            >
              <h3 className="text-xl font-bold mb-2">{prob.title}</h3>
              <p className="text-sm text-gray-600 mb-1">Tag: {prob.tag}</p>
              <p className="text-sm text-gray-600">Difficulty: {prob.difficulty}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Stats Section */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 bg-white text-center"
      >
        <h2 className="text-3xl font-bold mb-10">Platform Stats</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {stats.map(([emoji, number, label], idx) => (
            <div key={idx} className="bg-gray-50 p-6 rounded-lg shadow hover:shadow-md hover:scale-105 transition">
              <div className="text-4xl mb-2">{emoji}</div>
              <h3 className="text-2xl font-bold mb-1">{number}</h3>
              <p className="text-lg">{label}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="py-16 px-6 bg-gray-100 text-center"
      >
        <h2 className="text-3xl font-bold mb-10">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto text-left">
          {[
            ["1️⃣", "Sign Up & Choose a Problem"],
            ["2️⃣", "Write Code in our Online IDE"],
            ["3️⃣", "Submit and Get Instant Verdict"],
          ].map(([emoji, step], idx) => (
            <div key={idx} className="p-6 bg-gray-50 rounded-lg shadow hover:shadow-md transition hover:scale-105">
              <div className="text-4xl mb-2">{emoji}</div>
              <p className="text-lg font-semibold">{step}</p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 text-center">
        <p className="text-sm mb-2">Built with ❤️ using React, Node.js, Docker, and MongoDB Atlas</p>
        <p className="text-sm">© {new Date().getFullYear()} OJ Platform by Suraj Yadav. All rights reserved.</p>
        <div className="mt-2 flex justify-center gap-4">
          <a href="https://github.com/surajyadav1975" className="underline hover:text-gray-400" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/suraj-yadav-3449a62ab/" className="underline hover:text-gray-400" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
      </footer>
    </div>
  );
};

export default Firstpage;
