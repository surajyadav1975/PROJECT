import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateProblem from './CreateProblem'; 
import UserDashboard from './UserDashboard';

const Dashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [problems, setProblems] = useState([]);
    const [activeSection, setActiveSection] = useState("problems");

    useEffect(() => {
        const getProblemList = async () => {
            try {
                const p = await axios.get("http://localhost:3000/problemlist", { withCredentials: true });
                setProblems(p.data.prob);
            } catch (err) {
                console.log("Error fetching problems:", err.response?.data?.message);
                navigate('/login');
            }
        };

        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:3000/dashboard', { withCredentials: true });
                if (res.data.usertype === 'Admin') {
                    getProblemList();
                }
                setUser(res.data);
            } catch (err) {
                console.log('Unauthorized access, redirecting...');
                navigate('/');
            }
        };

        fetchUser();
    }, [navigate]);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/delete/${id}`, { withCredentials: true });
            alert('Problem deleted successfully.');
            setProblems(problems.filter(problem => problem._id !== id));
        } catch (err) {
            console.error('Error deleting problem:', err);
            alert('Failed to delete the problem.');
        }
    };

    if (!user) return <div className="text-center mt-10 text-lg">Loading...</div>;

    return (
        <div className="flex min-h-screen bg-gray-100">
            {user.usertype === 'Admin' ? (
                <>
                    <div className="w-64 bg-gray-900 text-white flex flex-col p-6 space-y-6 shadow-lg">
                        <h2 className="text-3xl font-bold text-center mb-8">Admin Panel</h2>
                        <button
                            onClick={() => setActiveSection("create")}
                            className={`px-4 py-3 rounded text-left hover:bg-gray-800 transition ${activeSection === "create" ? "bg-gray-800" : ""}`}
                        >
                            ➕ Create Problem
                        </button>
                        <button
                            onClick={() => setActiveSection("problems")}
                            className={`px-4 py-3 rounded text-left hover:bg-gray-800 transition ${activeSection === "problems" ? "bg-gray-800" : ""}`}
                        >
                            📄 View Problems
                        </button>
                    </div>

                    <div className="flex-1 p-8 overflow-y-auto">
                        <h1 className="text-4xl font-bold mb-8">Welcome, {user.fullname}</h1>

                        {activeSection === "create" && <CreateProblem />}
                        {activeSection === "problems" && (
                            <div className="space-y-4">
                                <table className="w-full border border-gray-300 rounded-lg shadow-md overflow-hidden">
                                    <thead className="bg-gray-200">
                                        <tr>
                                            <th className="py-3 px-4 text-left">ID</th>
                                            <th className="py-3 px-4 text-left">Title</th>
                                            <th className="py-3 px-4 text-left">Edit</th>
                                            <th className="py-3 px-4 text-left">Delete</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {problems.map((problem, index) => (
                                            <tr key={problem._id} className="border-t hover:bg-gray-50 transition">
                                                <td className="py-3 px-4 font-bold">{index + 1}</td>
                                                <td
                                                    className="py-3 px-4 font-bold cursor-pointer hover:underline"
                                                    onClick={() => navigate(`/ide/${problem._id}`)}
                                                >
                                                    {problem.title}
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); navigate(`/edit/${problem._id}`); }}
                                                        className="bg-green-100 font-bold px-4 py-1 rounded hover:bg-green-300 transition"
                                                    >
                                                        ✏️ Edit
                                                    </button>
                                                </td>
                                                <td>
                                                    <button
                                                        onClick={(e)=>{
                                                            e.stopPropagation();
                                                            const confirmDelete = window.confirm('Are you sure you want to delete this problem? This action cannot be undone.');
                                                            if (confirmDelete) {
                                                                handleDelete(problem._id);
                                                            }
                                                        }}
                                                        className="bg-red-100 font-bold px-4 py-1 rounded hover:bg-red-300 transition"
                                                    >
                                                        🗑️ Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            ) : (<UserDashboard user={user}></UserDashboard>)}
        </div>
    );
};

export default Dashboard;