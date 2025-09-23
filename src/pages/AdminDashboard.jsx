import { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { Link } from 'react-router-dom';
import { FaUsers, FaClipboardCheck, FaChartBar, FaSignOutAlt, FaFilter } from 'react-icons/fa';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import NeuralNetworkCanvas from '../components/NeuralNetwork.jsx'; // 1. Import the new animation

function AdminDashboard() {
  const [allScreenings, setAllScreenings] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Listeners for real-time Firestore data
    const usersUnsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setTotalUsers(snapshot.size);
    });
    const screeningsQuery = query(collection(db, "screenings"), orderBy("createdAt", "desc"));
    const screeningsUnsub = onSnapshot(screeningsQuery, (snapshot) => {
      setAllScreenings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });
    return () => {
      usersUnsub();
      screeningsUnsub();
    };
  }, []);

  // Derived state for dynamic filtering
  const displayedScreenings = selectedUser
    ? allScreenings.filter(s => s.userId === selectedUser.userId)
    : allScreenings;
  
  const screeningsCompleted = displayedScreenings.length;
  const highRiskCount = displayedScreenings.filter(s => s.result === 'High').length;
  const recentScreenings = displayedScreenings.slice(0, 7);

  // Memoized calculations for charts
  const monthlyData = useMemo(() => {
    const monthlySummary = {};
    displayedScreenings.forEach(s => {
      if (s.createdAt) {
        const month = s.createdAt.toDate().toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!monthlySummary[month]) monthlySummary[month] = { name: month, High: 0, Moderate: 0, Mild: 0 };
        if (s.result) monthlySummary[month][s.result]++;
      }
    });
    return Object.values(monthlySummary).reverse();
  }, [displayedScreenings]);

  const pieData = useMemo(() => {
    const riskCounts = displayedScreenings.reduce((acc, s) => {
      if (s.result) acc[s.result] = (acc[s.result] || 0) + 1;
      return acc;
    }, {});
    return [
      { name: 'High Risk', value: riskCounts.High || 0, color: '#ef4444' },
      { name: 'Moderate Risk', value: riskCounts.Moderate || 0, color: '#f59e0b' },
      { name: 'Mild Risk', value: riskCounts.Mild || 0, color: '#22c55e' },
    ];
  }, [displayedScreenings]);

  const handleLogout = () => { signOut(auth).then(() => navigate('/')); };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* 2. Add the animated background */}
      <NeuralNetworkCanvas />
      <div className="absolute inset-0 bg-black/60"></div>
      
      <header className="relative z-10 bg-white/10 backdrop-blur-md shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Admin Analytics</h1>
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="text-sm font-medium text-gray-200 hover:text-white">User View</Link>
            <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-medium text-gray-200 hover:text-white"><FaSignOutAlt /> Logout</button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {loading ? <p className="text-center text-white">Loading analytics...</p> : (
          <>
            {selectedUser && (
              <div className="bg-blue-500/20 border border-blue-400 text-white p-4 rounded-xl mb-8 flex justify-between items-center">
                <div>
                  <h3 className="font-bold flex items-center gap-2"><FaFilter /> Filter Active</h3>
                  <p className="text-sm">Showing analytics for: <strong>{selectedUser.userName}</strong></p>
                </div>
                <button onClick={() => setSelectedUser(null)} className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-md text-sm">Clear Filter</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard icon={<FaUsers />} title="Total Users" value={totalUsers} />
              <StatCard icon={<FaClipboardCheck />} title="Screenings Shown" value={screeningsCompleted} />
              <StatCard icon={<FaChartBar />} title="High-Risk Screenings" value={highRiskCount} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              <div className="lg:col-span-2 bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20">
                <h2 className="font-bold text-white mb-4">Risk Levels Over Time</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                    <XAxis dataKey="name" stroke="#a3a3a3" />
                    <YAxis stroke="#a3a3a3" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none' }} />
                    <Legend />
                    <Line type="monotone" dataKey="High" stroke="#ef4444" strokeWidth={2} name="High Risk" />
                    <Line type="monotone" dataKey="Moderate" stroke="#f59e0b" strokeWidth={2} name="Moderate Risk" />
                    <Line type="monotone" dataKey="Mild" stroke="#22c55e" strokeWidth={2} name="Mild Risk" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20">
                <h2 className="font-bold text-white mb-4">Screening Breakdown</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                      {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-lg border border-white/20">
              <h2 className="text-xl font-bold text-white mb-4">Recent Screenings</h2>
              <p className="text-sm text-white/60 mb-4">Click a user to filter all analytics.</p>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="border-b border-white/20"><th className="p-3 text-sm font-semibold">User Name</th><th className="p-3 text-sm font-semibold">Result</th><th className="p-3 text-sm font-semibold">Age</th><th className="p-3 text-sm font-semibold">Gender</th><th className="p-3 text-sm font-semibold">Date</th></tr>
                  </thead>
                  <tbody>
                    {recentScreenings.map(screening => (
                      <tr key={screening.id} className="border-b border-white/10 hover:bg-white/20 cursor-pointer" onClick={() => setSelectedUser(screening)}>
                        <td className="p-3 font-medium">{screening.userName}</td>
                        <td className="p-3"><span className={`px-2 py-1 inline-block rounded-full text-xs font-semibold ${screening.result === 'High' ? 'bg-red-500/70 text-white' : screening.result === 'Moderate' ? 'bg-yellow-500/70 text-white' : 'bg-green-500/70 text-white'}`}>{screening.result}</span></td>
                        <td className="p-3">{screening.age}</td>
                        <td className="p-3">{screening.gender}</td>
                        <td className="p-3">{screening.createdAt?.toDate().toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-xl shadow-lg flex items-center gap-4 text-white">
    <div className="text-3xl text-white">{icon}</div>
    <div>
      <p className="text-gray-300 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;

