import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../firebase';
import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { FaBookMedical, FaPenFancy, FaTrash } from 'react-icons/fa';

function MyJourney() {
  const [screenings, setScreenings] = useState([]);
  const [journalEntries, setJournalEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  // Fetch screening and journal history
  useEffect(() => {
    if (!user) return;

    // Fetch screenings
    const screeningsQuery = query(
      collection(db, "screenings"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const screeningsUnsub = onSnapshot(screeningsQuery, (snapshot) => {
      setScreenings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    });

    // Fetch journal entries
    const journalQuery = query(
      collection(db, "journals", user.uid, "entries"),
      orderBy("createdAt", "desc")
    );
    const journalUnsub = onSnapshot(journalQuery, (snapshot) => {
      setJournalEntries(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return () => {
      screeningsUnsub();
      journalUnsub();
    };
  }, [user]);

  const handleAddEntry = async (e) => {
    e.preventDefault();
    if (newEntry.trim() === '' || !user) return;

    await addDoc(collection(db, "journals", user.uid, "entries"), {
      text: newEntry,
      createdAt: serverTimestamp(),
    });
    setNewEntry('');
  };

  const handleDeleteEntry = async (entryId) => {
    if (!user) return;
    if (window.confirm("Are you sure you want to delete this journal entry?")) {
      await deleteDoc(doc(db, "journals", user.uid, "entries", entryId));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">My Wellness Journey</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Screening History */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-3"><FaBookMedical className="text-blue-500" /> Screening History</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
              {loading && <p>Loading history...</p>}
              {!loading && screenings.length === 0 && <p className="text-gray-500">You haven't completed any screenings yet.</p>}
              {screenings.map(s => (
                <div key={s.id} className="border-l-4 p-4 rounded-r-lg bg-gray-50" style={{ borderColor: s.result === 'High' ? '#ef4444' : s.result === 'Moderate' ? '#f59e0b' : '#22c55e' }}>
                  <p className="font-semibold text-lg">{s.result} Risk Level</p>
                  <p className="text-sm text-gray-500">{s.createdAt?.toDate().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Private Journal */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-700 mb-4 flex items-center gap-3"><FaPenFancy className="text-purple-500" /> Private Journal</h2>
            <form onSubmit={handleAddEntry} className="mb-4">
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                placeholder="Write down your thoughts..."
                className="w-full p-3 border rounded-lg h-28 focus:ring-2 focus:ring-purple-400"
              />
              <button type="submit" className="mt-2 w-full bg-purple-600 text-white font-semibold py-2 rounded-lg hover:bg-purple-700 transition">Save Entry</button>
            </form>
            <div className="space-y-3 max-h-56 overflow-y-auto pr-2">
              {journalEntries.length === 0 && <p className="text-gray-500">Your journal is empty.</p>}
              {journalEntries.map(entry => (
                <div key={entry.id} className="bg-gray-50 p-3 rounded-lg group">
                  <p className="text-xs text-gray-400 mb-1">{entry.createdAt?.toDate().toLocaleString('en-IN')}</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{entry.text}</p>
                  <button onClick={() => handleDeleteEntry(entry.id)} className="text-xs text-red-400 mt-2 opacity-0 group-hover:opacity-100 transition"><FaTrash /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyJourney;
