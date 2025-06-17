import React, { useEffect } from "react";
import { useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const ProblemList = () => {
  const navigate=useNavigate();
  const [problems, setproblems] = useState([]);

  useEffect(() => {
    const getproblemlist = async () => {
      try {
        const p = await axios.get("http://localhost:3000/problemlist", {
          withCredentials: true,
        });
        setproblems(p.data.prob);
      } catch (err) {
        console.log("Error fetching problems:", err.response.data.message);
        // setLoading(false);
        navigate('/login');
      }
    };
    getproblemlist();
  }, []);

  return (
    <div className="max-w-5xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        🧠 Problem List
      </h1>

      <table className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">ID</th>
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem, index) => (
            <tr
              key={problem._id}
              className="border-t hover:bg-gray-50 transition"
              onClick={() => navigate(`/ide/${problem._id}`)}
            >
              <td className="py-3 px-4 font-bold">{index + 1}</td>
              <td className="py-3 px-4 font-bold">{problem.title}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded-full text-sm font-medium ${
                    problem.difficulty === 'Easy'
                      ? 'bg-green-100 text-green-700'
                      : problem.difficulty === 'Medium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-700'
                  }`}
                >
                  {problem.difficulty}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

  );
};

export default ProblemList;
