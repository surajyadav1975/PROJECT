import React, { useEffect } from "react";
import { useState} from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const ProblemList = () => {
  const navigate=useNavigate();
  const [problems, setproblems] = useState([]);
  const apiurl = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const getproblemlist = async () => {
      try {
        const p = await axios.get(`${apiurl}/problemlist`, {
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
     <div className="min-h-screen bg-gradient-to-r font-serif from-blue-50 to-purple-100 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white p-10 rounded-3xl shadow-xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-center text-Black mb-10">
          Problem List
        </h1>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-2 font-serif">
            <thead>
              <tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-white rounded-lg">
                <th className="py-3 px-4 text-left text-base font-semibold rounded-l-lg">
                  ID
                </th>
                <th className="py-3 px-4 text-left text-base font-semibold">Title</th>
                <th className="py-3 px-4 text-left text-base font-semibold rounded-r-lg">
                  Difficulty
                </th>
              </tr>
            </thead>
            <tbody>
              {problems.map((problem, index) => (
                <tr
                  key={problem._id}
                  className="hover:bg-gray-200 cursor-pointer transition border-b border-gray-300 last:border-b-0"
                  onClick={() => navigate(`/ide/${problem._id}`)}
                >
                  <td className="py-2 px-4 text-gray-800 font-medium">{index + 1}</td>
                  <td className="py-2 px-4">
                    <p className="text-black font-semibold">{problem.title}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {problem.tag.split(",").map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-2 px-4 rounded-r-lg">
                    <span
                      className={`px-3 py-2 rounded text-xs font-semibold shadow-sm ${
                        problem.difficulty === "Easy"
                          ? "bg-green-100 text-green-800 shadow-green-300"
                          : problem.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-800 shadow-yellow-300"
                          : "bg-red-100 text-red-800 shadow-red-300"
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
      </div>
    </div>

  );
};

export default ProblemList;
