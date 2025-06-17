import React from 'react';
import { useState } from 'react';


const ProblemList = () => {
  const [problems,setproblems]=useState([
    { id: 1, name: 'Two Sum' },
    { id: 2, name: 'Reverse a Linked List' },
    { id: 3, name: 'Valid Parentheses' },
    { id: 4, name: 'Find Duplicate Number' },
    { id: 5, name: 'Merge Intervals' },
  ]);


  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">🧠 Problem List</h1>
      <table className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="py-3 px-4 text-left">No.</th>
            <th className="py-3 px-4 text-left">Problem Name</th>
          </tr>
        </thead>
        <tbody>
          {problems.map((problem) => (
            <tr
              key={problem.id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="py-3 px-4">{problem.id}</td>
              <td className="py-3 px-4">{problem.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProblemList;
