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
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Create a Problem</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block font-medium">Title</label>
          <input {...register("title", { required: true })} className="w-full border px-4 py-2 rounded" />
          {errors.title && <p className="text-red-500 text-sm">Title is required</p>}
        </div>

        <div>
          <label className="block font-medium">Tag</label>
          <input {...register("tag", { required: true })} className="w-full border px-4 py-2 rounded" />
          {errors.tag && <p className="text-red-500 text-sm">Tag is required</p>}
        </div>

        <div>
          <label className="block font-medium">Difficulty</label>
          <select {...register("difficulty", { required: true })} className="w-full border px-4 py-2 rounded">
            <option value="">Select</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Description</label>
          <textarea {...register("description", { required: true })} className="w-full border px-4 py-2 rounded" rows={4} />
        </div>
        <div>
          <label className="block font-bold mb-2 text-lg">Test Cases</label>
          {testcases.map((tc, index) => (
            <div key={index} className="mb-4 p-4 border rounded space-y-2 bg-gray-50">
              <div>
                <label className="block">Input</label>
                <textarea
                  value={tc.input}
                  onChange={(e) => handleTestcaseChange(index, "input", e.target.value)}
                  className="w-full border px-3 py-1 rounded"
                  rows={2}
                />
              </div>

              <div>
                <label className="block">Expected Output</label>
                <textarea
                  value={tc.output}
                  onChange={(e) => handleTestcaseChange(index, "output", e.target.value)}
                  className="w-full border px-3 py-1 rounded"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={tc.visible}
                  onChange={(e) => handleTestcaseChange(index, "visible", e.target.checked)}
                />
                <label>Visible to user?</label>

                {testcases.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveTestcase(index)}
                    className="ml-auto text-red-600 text-sm"
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
            className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
          >
            ➕ Add Testcase
          </button>
        </div>

        <div className="text-center">
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            Create Problem
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProblem;