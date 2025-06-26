import React from 'react'
import { useState ,useEffect} from 'react';
import axios from 'axios';

function UserDashboard({user}) {
     const [stats, setStats] = useState({ problemsSolved: 0, submissionsDone: 0 });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get('http://localhost:3000/userstats', { withCredentials: true });
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };

        fetchStats();
    }, []);

    return (
   <div className="max-w-4xl mx-auto p-8 bg-gradient-to-r from-blue-50 to-purple-100 shadow-2xl rounded-2xl mt-12 space-y-8">
        <h2 className="text-4xl font-extrabold mb-6 text-center text-gray-800 tracking-wide">
            📊 User Dashboard
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">👤 Username</h3>
                <p className="text-lg text-gray-600">{user.username}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">🪪 Full Name</h3>
                <p className="text-lg text-gray-600">{user.fullname}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">📧 Email</h3>
                <p className="text-lg text-gray-600">{user.email}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">✅ Problems Solved</h3>
                <p className="text-lg text-gray-600">{stats.problemsSolved || 0}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">📄 Submissions Done</h3>
                <p className="text-lg text-gray-600">{stats.submissionsDone || 0}</p>
            </div>
        </div>
    </div>

  )
}

export default UserDashboard