import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CreateProblem = () => {
  const navigate=useNavigate();

  useEffect(()=>{
    const checkadmin=async ()=>{
      try {
        const res = await axios.get("http://localhost:3000/dashboard", {
          withCredentials: true,
        });
      } catch (err) {
        console.log("You are not authorized to access dashboard, you are just an simple little user its only for admin's.");
        navigate("/"); 
      }
    }
    checkadmin();
  },[navigate])

  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [testcases, setTestcases] = useState([
    { input: "", output: "", visible: false }
  ]);

  const handleAddTestcase = () => {
    setTestcases([...testcases, { input: "", output: "", visible: false }]);
  };

  const handleRemoveTestcase = (index) => {
    const updated = [...testcases];
    updated.splice(index, 1);
    setTestcases(updated);
  };

  const handleTestcaseChange = (index, field, value) => {
    const updated = [...testcases];
    updated[index][field] = value;
    setTestcases(updated);
  };

  const onSubmit = async (data) => {
    const problemPayload = {
      ...data,
      testcases
    };


    try {
      const response=await axios.post("http://localhost:3000/createproblem", problemPayload,
        { withCredentials: true }
      );
      console.log(response.data.message);
      reset()
      setTestcases([{ input: "", output: "", visible: false }]);
    } catch (err) {
      console.error(err);
      alert(err.response.data.message);
    }
  };

  return (
  <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg border border-gray-700">
    <h2 className="text-4xl font-bold mb-8 text-center text-gray-900">📋 Create a Problem</h2>
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <div>
        <label className="block font-semibold text-gray-700 mb-2">Title</label>
        <input {...register("title", { required: true })} 
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {errors.title && <p className="text-red-500 text-sm mt-1">Title is required</p>}
      </div>

      <div>
        <label className="block font-semibold text-gray-700 mb-2">Tag</label>
        <input {...register("tag", { required: true })} 
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
        {errors.tag && <p className="text-red-500 text-sm mt-1">Tag is required</p>}
      </div>

      <div>
        <label className="block font-semibold text-gray-700 mb-2">Difficulty</label>
        <select {...register("difficulty", { required: true })}
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">Select</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold text-gray-700 mb-2">Description</label>
        <textarea {...register("description", { required: true })} 
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" rows={4} />
      </div>

      <div>
        <label className="block font-bold text-gray-800 mb-4 text-lg">Test Cases</label>
        {testcases.map((tc, index) => (
          <div key={index} className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50 space-y-4 shadow-sm">
            <div>
              <label className="block font-semibold text-gray-700 mb-1">Input</label>
              <textarea
                value={tc.input}
                onChange={(e) => handleTestcaseChange(index, "input", e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>

            <div>
              <label className="block font-semibold text-gray-700 mb-1">Expected Output</label>
              <textarea
                value={tc.output}
                onChange={(e) => handleTestcaseChange(index, "output", e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={tc.visible}
                onChange={(e) => handleTestcaseChange(index, "visible", e.target.checked)}
                className="w-4 h-4"
              />
              <label className="text-gray-700 text-sm">Visible to user?</label>

              {testcases.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveTestcase(index)}
                  className="ml-auto text-red-600 text-sm hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddTestcase}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ➕ Add Testcase
        </button>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Problem
        </button>
      </div>
    </form>
  </div>

  );
};

export default CreateProblem;