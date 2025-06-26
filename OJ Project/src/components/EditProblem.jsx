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
        <div className="max-w-4xl mx-auto mt-10 p-8 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Edit Problem</h2>
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
                    {fields.map((field, index) => (
                        <div key={field.id} className="mb-4 p-4 border rounded space-y-2 bg-gray-50">
                            <div>
                                <label className="block">Input</label>
                                <textarea
                                    {...register(`testcases.${index}.input`, { required: true })}
                                    className="w-full border px-3 py-1 rounded"
                                    rows={2}
                                />
                                {errors.testcases?.[index]?.input && <p className="text-red-500 text-sm">Input is required</p>}
                            </div>

                            <div>
                                <label className="block">Expected Output</label>
                                <textarea
                                    {...register(`testcases.${index}.output`, { required: true })}
                                    className="w-full border px-3 py-1 rounded"
                                    rows={2}
                                />
                                {errors.testcases?.[index]?.output && <p className="text-red-500 text-sm">Output is required</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    {...register(`testcases.${index}.visible`)}
                                />
                                <label>Visible to user?</label>

                                {fields.length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
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
                        onClick={() => append({ input: "", output: "", visible: false })}
                        className="mt-2 bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
                    >
                        ➕ Add Testcase
                    </button>
                </div>

                <div className="text-center">
                    <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                        Update Problem
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProblem;
