import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebase"; // We need this to get the user's name
import { FaRobot, FaClipboardList, FaBook, FaCalendarAlt, FaQuoteLeft, FaWind } from 'react-icons/fa';

// A simple array of affirmations
const affirmations = [
  "You are capable of amazing things.",
  "Your potential is limitless.",
  "You are in charge of your own happiness.",
  "Today is a new day, full of opportunity.",
  "You are resilient, strong, and brave.",
  "Positive thoughts create positive feelings.",
];

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('');
  const [greeting, setGreeting] = useState('');
  const [affirmation, setAffirmation] = useState('');

  useEffect(() => {
    // Set the user's name
    const user = auth.currentUser;
    if (user && user.displayName) {
      setUserName(user.displayName.split(' ')[0]); // Get first name
    } else {
      setUserName('User');
    }

    // Set greeting based on the time of day
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
    
    // Set a random daily affirmation
    setAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);

  }, []);

  const handleLogoutClick = () => {
    onLogout();
    navigate("/");
  };

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center p-6 bg-cover bg-center text-white relative"
      style={{ backgroundImage: "url('/mountain-bg.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Logout Button in the corner */}
      <button
        onClick={handleLogoutClick}
        className="absolute top-6 right-6 z-20 bg-red-600/80 hover:bg-red-700 px-4 py-2 rounded-lg shadow-md transition-colors"
      >
        Logout
      </button>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">{greeting}, {userName}!</h1>
          <p className="text-lg md:text-xl text-white/80">Welcome to your personal wellness space.</p>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Main Navigation Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <NavCard 
              to="/chatbot" 
              icon={<FaRobot />} 
              title="AI Wellness Coach" 
              description="Chat with our AI for immediate, supportive guidance."
              color="purple"
            />
            <NavCard 
              to="/screening" 
              icon={<FaClipboardList />} 
              title="Mental Health Screening" 
              description="A confidential questionnaire to understand your needs."
              color="blue"
            />
            <NavCard 
              to="/resources" 
              icon={<FaBook />} 
              title="Interactive Resources" 
              description="Fun, engaging activities to boost your mood and relax."
              color="green"
            />
            <NavCard 
              to="/booking" 
              icon={<FaCalendarAlt />} 
              title="Book a Counselor" 
              description="Schedule a private session with a professional."
              color="pink"
            />
          </div>

          {/* Right Column: Widgets */}
          <div className="space-y-6">
            <WidgetCard icon={<FaQuoteLeft />} title="Daily Affirmation">
              <p className="text-lg italic text-white/90">"{affirmation}"</p>
            </WidgetCard>
            <WidgetCard icon={<FaWind />} title="Today's Focus">
              <p className="text-white/90 mb-4">Feeling stressed? Take a moment for yourself.</p>
              <Link to="/exercises" className="bg-white/20 hover:bg-white/40 font-semibold px-4 py-2 rounded-lg shadow-md transition-colors">
                Try a Breathing Exercise
              </Link>
            </WidgetCard>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable component for the main navigation cards
const NavCard = ({ to, icon, title, description, color }) => {
  const colors = {
    purple: 'from-purple-500/50 to-purple-600/50 hover:bg-purple-600/60',
    blue: 'from-blue-500/50 to-blue-600/50 hover:bg-blue-600/60',
    green: 'from-green-500/50 to-green-600/50 hover:bg-green-600/60',
    pink: 'from-pink-500/50 to-pink-600/50 hover:bg-pink-600/60',
  }
  return (
    <Link to={to} className={`bg-gradient-to-br ${colors[color]} backdrop-blur-md p-6 rounded-2xl shadow-lg flex flex-col text-left transition-transform transform hover:-translate-y-1`}>
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-white/80">{description}</p>
    </Link>
  );
};

// Reusable component for the sidebar widgets
const WidgetCard = ({ icon, title, children }) => (
  <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl shadow-lg text-left">
    <div className="flex items-center gap-3 mb-3">
      <div className="text-xl">{icon}</div>
      <h3 className="font-bold">{title}</h3>
    </div>
    {children}
  </div>
);