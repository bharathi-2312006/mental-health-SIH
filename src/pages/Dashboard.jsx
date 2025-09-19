import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, getDoc, collection, query, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { FaRobot, FaClipboardList, FaBook, FaCalendarAlt, FaQuoteLeft, FaWind, FaUserShield, FaChartLine } from 'react-icons/fa';

const affirmations = [
  "You are capable of amazing things.",
  "Your potential is limitless.",
  "You are in charge of your own happiness.",
  "Today is a new day, full of opportunity.",
];

function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [affirmation, setAffirmation] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [lastScreening, setLastScreening] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Automatic redirect for admins
      const checkAdminAndRedirect = async () => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          setIsAdmin(true);
          navigate('/admin');
        } else {
          setLoading(false);
        }
      };
      checkAdminAndRedirect();

      setUserName(user.displayName ? user.displayName.split(' ')[0] : 'User');
      
      const screeningsQuery = query(
        collection(db, "screenings"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(1)
      );
      const unsubscribe = onSnapshot(screeningsQuery, (snapshot) => {
        if (!snapshot.empty) {
          setLastScreening(snapshot.docs[0].data());
        }
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }

    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);

  }, [navigate]);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  const FocusWidget = () => { /* ... (FocusWidget logic remains the same) ... */ };
  
  if (isAdmin || loading) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  return (
    // --- THIS IS THE CORRECTED PART ---
    <div 
      className="h-screen w-full flex flex-col items-center justify-center p-6 bg-cover bg-center text-white relative"
      style={{ backgroundImage: "url('/mountain-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <button onClick={handleLogoutClick} className="absolute top-6 right-6 z-20 bg-red-600/80 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md transition-colors">Logout</button>
      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-10"><h1 className="text-4xl md:text-5xl font-bold mb-2">{greeting}, {userName}!</h1><p className="text-lg md:text-xl text-white/80">Welcome to your personal wellness space.</p></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <NavCard to="/my-journey" icon={<FaChartLine />} title="My Journey" description="Track your screening history and private journal entries." color="yellow" />
            <NavCard to="/chatbot" icon={<FaRobot />} title="AI Wellness Coach" description="Chat with our AI for immediate, supportive guidance." color="purple" />
            <NavCard to="/screening" icon={<FaClipboardList />} title="Mental Health Screening" description="A confidential questionnaire to understand your needs." color="blue" />
            <NavCard to="/resources" icon={<FaBook />} title="Interactive Resources" description="Fun, engaging activities to boost your mood and relax." color="green" />
          </div>
          <div className="space-y-6">
            <WidgetCard icon={<FaQuoteLeft />} title="Daily Affirmation"><p className="text-lg italic text-white/90">"{affirmation}"</p></WidgetCard>
            {isAdmin && ( <Link to="/admin" className="block"><div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-left flex items-center gap-4 hover:bg-white/20 transition-colors"><div className="text-2xl text-yellow-300"><FaUserShield /></div><div><h3 className="font-bold">Admin Panel</h3><p className="text-sm text-white/70">Access user statistics.</p></div></div></Link> )}
            <FocusWidget />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- (Your NavCard, WidgetCard, and FocusWidget components go here) ---
const NavCard = ({ to, icon, title, description, color }) => { const colors = { purple: 'from-purple-500/50 to-purple-600/50 hover:bg-purple-600/60', blue: 'from-blue-500/50 to-blue-600/50 hover:bg-blue-600/60', green: 'from-green-500/50 to-green-600/50 hover:bg-green-600/60', pink: 'from-pink-500/50 to-pink-600/50 hover:bg-pink-600/60', yellow: 'from-yellow-500/50 to-yellow-600/50 hover:bg-yellow-600/60'}; return ( <Link to={to} className={`bg-gradient-to-br ${colors[color]} backdrop-blur-md p-6 rounded-2xl shadow-lg flex flex-col text-left transition-transform transform hover:-translate-y-1`}> <div className="text-3xl mb-3">{icon}</div> <h3 className="text-xl font-bold mb-2">{title}</h3> <p className="text-white/80">{description}</p> </Link> ); };
const WidgetCard = ({ icon, title, children }) => ( <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-left"> <div className="flex items-center gap-3 mb-3"> <div className="text-xl">{icon}</div> <h3 className="font-bold">{title}</h3> </div> {children} </div> );

export default Dashboard;

