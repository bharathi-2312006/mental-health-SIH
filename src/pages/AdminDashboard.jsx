import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { Link } from 'react-router-dom';
import { FaUsers, FaClipboardCheck, FaChartBar, FaSignOutAlt, FaTimes } from 'react-icons/fa';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import bgImage from '../assets/admin-bg.jpg';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, highRisk: 0, screeningsCompleted: 0 });
  const [monthlyData, setMonthlyData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentScreenings, setRecentScreenings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Listeners for real-time Firestore data
    const usersUnsub = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats(prev => ({ ...prev, totalUsers: snapshot.size }));
    });

    const screeningsQuery = query(collection(db, "screenings"), orderBy("createdAt", "desc"));
    const screeningsUnsub = onSnapshot(screeningsQuery, (snapshot) => {
      const screenings = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const highRiskCount = screenings.filter(s => s.result === 'High').length;
      setRecentScreenings(screenings.slice(0, 7));
      setStats(prev => ({ ...prev, screeningsCompleted: screenings.length, highRisk: highRiskCount }));

      const monthlySummary = {};
      screenings.forEach(s => {
        if (s.createdAt) {
          const month = s.createdAt.toDate().toLocaleString('default', { month: 'short', year: '2-digit' });
          if (!monthlySummary[month]) {
            monthlySummary[month] = { name: month, High: 0, Moderate: 0, Mild: 0 };
          }
          if(s.result) monthlySummary[month][s.result]++;
        }
      });
      setMonthlyData(Object.values(monthlySummary).reverse());

      const riskCounts = screenings.reduce((acc, s) => {
        if(s.result) acc[s.result] = (acc[s.result] || 0) + 1;
        return acc;
      }, {});
      setPieData([
        { name: 'High Risk', value: riskCounts.High || 0, color: '#ef4444' },
        { name: 'Moderate Risk', value: riskCounts.Moderate || 0, color: '#f59e0b' },
        { name: 'Mild Risk', value: riskCounts.Mild || 0, color: '#22c55e' },
      ]);

      setLoading(false);
    });
    return () => { usersUnsub(); screeningsUnsub(); };
  }, []);

  useEffect(() => {
    if (selectedUser) {
      const historyQuery = query(collection(db, "screenings"), where("userId", "==", selectedUser.userId), orderBy("createdAt", "desc"));
      const unsub = onSnapshot(historyQuery, snapshot => setUserHistory(snapshot.docs.map(doc => doc.data())));
      return () => unsub();
    }
  }, [selectedUser]);

  const handleLogout = () => { signOut(auth).then(() => navigate('/')); };

  return (
    <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard icon={<FaUsers />} title="Total Users" value={stats.totalUsers} />
              <StatCard icon={<FaClipboardCheck />} title="Total Screenings" value={stats.screeningsCompleted} />
              <StatCard icon={<FaChartBar />} title="High-Risk Users" value={stats.highRisk} />
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
              <div className="overflow-x-auto">
                <table className="w-full text-left text-white">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="p-3 text-sm font-semibold">User Name</th>
                      <th className="p-3 text-sm font-semibold">Result</th>
                      <th className="p-3 text-sm font-semibold">Age</th>
                      <th className="p-3 text-sm font-semibold">Gender</th>
                      <th className="p-3 text-sm font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentScreenings.map(screening => (
                      <tr key={screening.id} className="border-b border-white/10 hover:bg-white/10 cursor-pointer" onClick={() => setSelectedUser(screening)}>
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

      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6 relative">
            <button onClick={() => setSelectedUser(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><FaTimes size={20} /></button>
            <h2 className="text-2xl font-bold text-gray-800 mb-1">Screening History</h2>
            <p className="text-gray-600 mb-4">{selectedUser.userName}</p>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
              {userHistory.map((entry, index) => (
                <div key={index} className="border-l-4 p-3 rounded-r-lg bg-gray-50" style={{ borderColor: entry.result === 'High' ? '#ef4444' : entry.result === 'Moderate' ? '#f59e0b' : '#22c55e' }}>
                  <p className="font-semibold text-gray-800">{entry.result} (Score: {entry.score})</p>
                  <p className="text-sm text-gray-500">{entry.createdAt?.toDate().toLocaleString()}</p>
                  <p className="text-xs text-gray-400 mt-1">Age: {entry.age}, Gender: {entry.gender}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
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

