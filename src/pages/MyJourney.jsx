import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { FaBookMedical, FaPenFancy, FaTrash, FaChartLine } from 'react-icons/fa';
import HeartParticleCanvas from '../components/HeartParticles';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useTranslation } from 'react-i18next';

function MyJourney() {
  const { t } = useTranslation();
  const [screenings, setScreenings] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        // --- Fetch Screenings with Error Handling ---
        const screeningsQuery = query(
          collection(db, "screenings"), 
          where("userId", "==", user.uid), 
          orderBy("createdAt", "asc")
        );
        
        const screeningsUnsub = onSnapshot(screeningsQuery, 
          (snapshot) => { // Success callback
            const screeningData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setScreenings(screeningData.slice().reverse());
            
            const formattedChartData = screeningData.map(s => ({
              date: s.createdAt?.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) || 'N/A',
              score: s.score,
            }));
            setChartData(formattedChartData);
            setLoading(false);
          }, 
          (error) => { // Error callback
            console.error("Screening listener error:", error);
            setLoading(false); // Stop loading on error
          }
        );

        // --- Fetch Journal Entries with Error Handling ---
        const journalQuery = query(collection(db, "journals", user.uid, "entries"), orderBy("createdAt", "desc"));
        
        const journalUnsub = onSnapshot(journalQuery, 
          (snapshot) => { // Success callback
            setJournalEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
          },
          (error) => { // Error callback
            console.error("Journal listener error:", error);
          }
        );

        return () => { // Cleanup function
          screeningsUnsub();
          journalUnsub();
        };
      } else {
        // No user is logged in
        setLoading(false);
        setScreenings([]);
        setJournalEntries([]);
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth listener
  }, []);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (newEntry.trim() === '' || !user) return;
    await addDoc(collection(db, "journals", user.uid, "entries"), { text: newEntry, createdAt: serverTimestamp() });
    setNewEntry('');
  };

  const handleDeleteEntry = async (entryId) => {
    const user = auth.currentUser;
    if (!user || !window.confirm("Are you sure you want to delete this journal entry?")) return;
    await deleteDoc(doc(db, "journals", user.uid, "entries", entryId));
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 sm:pt-32 px-4 sm:px-8 relative text-white">
      <HeartParticleCanvas />
      <div className="absolute inset-0 bg-black/60"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl font-bold text-center mb-8">{t('myJourneyPageTitle')}</h1>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 space-y-8">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><FaBookMedical className="text-blue-400" /> {t('screeningHistory')}</h2>
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                {loading && <p>{t('loadingHistory')}</p>}
                {!loading && screenings.length === 0 && <p className="text-gray-400">{t('noScreenings')}</p>}
                {screenings.map(s => (
                  <div key={s.id} className="border-l-4 p-4 rounded-r-lg bg-black/20" style={{ borderColor: s.result === 'High' ? '#ef4444' : s.result === 'Moderate' ? '#f59e0b' : '#22c55e' }}>
                    <p className="font-semibold text-lg">{s.result} {t('riskLevel')} (Score: {s.score})</p>
                    <p className="text-sm text-gray-300">{s.createdAt?.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><FaPenFancy className="text-purple-400" /> {t('privateJournal')}</h2>
              <form onSubmit={handleAddEntry} className="mb-4">
                <textarea value={newEntry} onChange={(e) => setNewEntry(e.target.value)} placeholder={t('writeThoughts')} className="w-full p-3 border rounded-lg h-28 bg-white/10 border-white/20 text-white focus:ring-2 focus:ring-purple-400" />
                <button type="submit" className="mt-2 w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition">{t('saveEntry')}</button>
              </form>
              <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
                {journalEntries.map(entry => (
                  <div key={entry.id} className="bg-black/20 p-3 rounded-lg group">
                    <p className="text-xs text-gray-400 mb-1">{entry.createdAt?.toDate().toLocaleString('en-IN')}</p>
                    <p className="whitespace-pre-wrap">{entry.text}</p>
                    <button onClick={() => handleDeleteEntry(entry.id)} className="text-xs text-red-400 mt-2 opacity-0 group-hover:opacity-100 transition"><FaTrash /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg border border-white/20">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><FaChartLine className="text-green-400" /> {t('yourProgress')}</h2>
            {loading ? <p>{t('loadingHistory')}</p> : screenings.length < 2 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                  <p className="text-gray-400">{t('chartHint')}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                      <XAxis dataKey="date" stroke="#a3a3a3" />
                      <YAxis stroke="#a3a3a3" domain={[0, 8]} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', border: 'none' }} />
                      <Legend />
                      <Line type="monotone" dataKey="score" stroke="#8884d8" strokeWidth={2} name="Risk Score" />
                  </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyJourney;

