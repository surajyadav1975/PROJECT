import React from 'react'
import { useState ,useEffect} from 'react';
import axios from 'axios';

function UserDashboard({user}) {
     const [stats, setStats] = useState({ problemsSolved: 0, submissionsDone: 0 });
    const apiurl = import.meta.env.VITE_BACKEND_URL;
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await axios.get(`${apiurl}/userstats`, { withCredentials: true });
                setStats(res.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="w-full p-10 mx-auto font-serif bg-white shadow-2xl rounded-2xl border border-gray-700 space-y-12">
            <h2 className="text-4xl font-extrabold text-center text-gray-900 tracking-wide">
            📊 User Dashboard
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
                { label: '👤 Username', value: user.username },
                { label: '🪪 Full Name', value: user.fullname },
                { label: '📧 Email', value: user.email },
                { label: '✅ Problems Solved', value: stats.problemsSolved || 0 },
                { label: '📄 Submissions Done', value: stats.submissionsDone || 0 }
            ].map((item, index) => (
                <div
                key={index}
                className="bg-gray-900 p-6 rounded-lg shadow-md hover:shadow-xl transition-transform transform hover:scale-105 border border-gray-700"
                >
                <h3 className="text-lg font-semibold text-gray-300 mb-2 tracking-wide">{item.label}</h3>
                <p className="text-2xl text-white font-bold break-words">{item.value}</p>
                </div>
            ))}
            </div>
        </div>
  )
}

export default UserDashboard