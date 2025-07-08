import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditProblem = () => {
    const { id } = useParams();
    console.log(id);
    const navigate = useNavigate();
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            title: "",
            tag: "",
            difficulty: "",
            description: "",
            testcases: []
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "testcases"
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProblem = async () => {
            try {
                 const res = await axios.get(`http://localhost:3000/problem/${id}`, {
                    withCredentials: true,
                });
                const problem = res.data.problem;
                console.log(problem);

                reset({
                    title: problem.title,
                    tag: problem.tag,
                    difficulty: problem.difficulty,
                    description: problem.description,
                    testcases: problem.testcases
                });
                setLoading(false);
            } catch (err) {
                console.error(err);
                alert("Failed to fetch problem.");
                navigate('/dashboard');
            }
        };

        fetchProblem();
    }, [id, navigate, reset]);

    const onSubmit = async (data) => {
        try {
            await axios.put(`http://localhost:3000/edit/${id}`, data, { withCredentials: true });
            alert("Problem updated successfully!");
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            alert("Failed to update problem.");
        }
    };

    if (loading) return <div className="text-center mt-10 text-lg">Loading problem...</div>;

    return (
        <div className="min-h-screen font-serif bg-gradient-to-r from-gray-900 to-gray-800 py-10 px-4 flex items-center justify-center">
  <div className="w-full max-w-4xl bg-white p-10 rounded-2xl shadow-2xl border border-gray-700 space-y-10">
    <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-8 tracking-wide">🛠️ Edit Problem</h2>

    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div>
        <label className="block font-semibold mb-2 text-gray-700">Title</label>
        <input
          {...register("title", { required: true })}
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">Title is required</p>}
      </div>

      <div>
        <label className="block font-semibold mb-2 text-gray-700">Tag</label>
        <input
          {...register("tag", { required: true })}
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.tag && <p className="text-red-500 text-sm mt-1">Tag is required</p>}
      </div>

      <div>
        <label className="block font-semibold mb-2 text-gray-700">Difficulty</label>
        <select
          {...register("difficulty", { required: true })}
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-2 text-gray-700">Description</label>
        <textarea
          {...register("description", { required: true })}
          className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
        />
      </div>

      <div>
        <label className="block font-extrabold mb-4 text-lg text-gray-800">Test Cases</label>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50 space-y-4">
            <div>
              <label className="block font-semibold mb-1 text-gray-700">Input</label>
              <textarea
                {...register(`testcases.${index}.input`, { required: true })}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              {errors.testcases?.[index]?.input && (
                <p className="text-red-500 text-sm mt-1">Input is required</p>
              )}
            </div>

            <div>
              <label className="block font-semibold mb-1 text-gray-700">Expected Output</label>
              <textarea
                {...register(`testcases.${index}.output`, { required: true })}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
              {errors.testcases?.[index]?.output && (
                <p className="text-red-500 text-sm mt-1">Output is required</p>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                {...register(`testcases.${index}.visible`)}
              />
              <label className="text-gray-700">Visible to user?</label>

              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
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
          onClick={() => append({ input: "", output: "", visible: false })}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          ➕ Add Testcase
        </button>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-8 py-3 rounded hover:bg-blue-700 transition font-semibold"
        >
          Update Problem
        </button>
      </div>
    </form>
  </div>
</div>

    );
};

export default EditProblem;
