import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash } from 'react-icons/fa';

// Page Imports
import Dashboard from "./pages/Dashboard.jsx";
import Screening from "./pages/Screening.jsx";
import Resources from "./pages/Resources.jsx";
import Booking from "./pages/Booking.jsx";
import ChatHub from './pages/ChatHub.jsx';
import TextChat from './pages/TextChat.jsx';
import VoiceChat from './pages/VoiceChat.jsx';
import Jokes from './pages/Jokes.jsx';
import Exercises from './pages/Exercises.jsx';
import BubbleWrap from './pages/BubbleWrap.jsx';
import MyJourney from './pages/MyJourney.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminRoute from './components/AdminRoute.jsx';

// Firebase Imports
import { auth, googleProvider, facebookProvider } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  browserPopupRedirectResolver
} from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // --- Authentication Handlers ---
  const handleSignup = async (e) => {
    e.preventDefault();
    const fullName = e.target.fullName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: fullName });
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver);
    } catch (err) {
      console.error("Google Login Error:", err);
      alert(err.message);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await signInWithPopup(auth, facebookProvider, browserPopupRedirectResolver);
    } catch (err) {
      alert(err.message);
    }
  };
  
  const handleLogout = () => {
    signOut(auth);
  };

  // --- Conditional Rendering ---
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // If user IS logged in, render the main application routes
  if (user) {
    return (
      <Routes>
        <Route path="/dashboard" element={<Dashboard onLogout={handleLogout} />} />
        <Route path="/screening" element={<Screening />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/chatbot" element={<ChatHub />} />
        <Route path="/text-chat" element={<TextChat />} />
        <Route path="/voice-chat" element={<VoiceChat />} />
        <Route path="/jokes" element={<Jokes />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/bubblewrap" element={<BubbleWrap />} />
        <Route path="/my-journey" element={<MyJourney />} />
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    );
  }
  
  // If user is NOT logged in, render the AuthPage UI
  return (
    <div className={`flex items-center justify-center min-h-screen bg-gradient-to-br ${isLoginView ? 'from-purple-200 via-pink-200 to-purple-300' : 'from-teal-200 via-cyan-200 to-blue-300'}`}>
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-10 w-full max-w-sm text-center relative">
        {isLoginView ? (
          <>
            <div className="flex justify-center -mt-20 mb-4">
              <div className="bg-purple-500 p-5 rounded-full shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 0112 15a4 4 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Login</h1>
            <form className="space-y-4" onSubmit={handleEmailLogin}>
              <div className="relative">
                <input type="email" name="email" placeholder="Email" className="w-full px-4 py-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400" required />
                <span className="absolute left-3 top-3.5 text-gray-400"><FaUser /></span>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password" placeholder="Password" className="w-full px-4 py-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400" required />
                <span className="absolute left-3 top-3.5 text-gray-400"><FaLock /></span>
                <span onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3.5 text-gray-500 cursor-pointer">{showPassword ? <FaEyeSlash /> : <FaEye />}</span>
              </div>
              <div className="text-right text-sm text-purple-600 cursor-pointer hover:underline">Forgot password?</div>
              <button type="submit" className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition">LOGIN</button>
            </form>
            <p className="mt-6 text-gray-500 text-sm">Or sign in using</p>
            <div className="flex justify-center gap-6 mt-4">
              <button onClick={handleGoogleLogin} className="bg-white border shadow-md p-3 rounded-full hover:scale-110 transition text-xl" aria-label="Login with Google"><FaGoogle className="text-red-500" /></button>
              <button onClick={handleFacebookLogin} className="bg-white border shadow-md p-3 rounded-full hover:scale-110 transition" aria-label="Login with Facebook"><img src="https://upload.wikimedia.org/wikipedia/commons/0/05/Facebook_Logo_%282019%29.png" alt="Facebook" className="h-6 w-6" /></button>
            </div>
            <p className="mt-6 text-gray-600 text-sm">Don't have an account?{" "}<span onClick={() => setIsLoginView(false)} className="text-purple-600 font-semibold cursor-pointer hover:underline">SIGN UP</span></p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Create Account</h1>
            <form className="space-y-4" onSubmit={handleSignup}>
              <div className="relative"><input type="text" name="fullName" placeholder="Full Name" className="w-full px-4 py-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400" required /><span className="absolute left-3 top-3.5 text-gray-400"><FaUser /></span></div>
              <div className="relative"><input type="email" name="email" placeholder="Email" className="w-full px-4 py-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400" required /><span className="absolute left-3 top-3.5 text-gray-400"><FaEnvelope /></span></div>
              <div className="relative"><input type="password" name="password" placeholder="Password" className="w-full px-4 py-3 pl-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400" required /><span className="absolute left-3 top-3.5 text-gray-400"><FaLock /></span></div>
              <button type="submit" className="w-full bg-black text-white py-3 rounded-md font-semibold hover:bg-gray-800 transition">SIGN UP</button>
            </form>
            <p className="mt-8 text-gray-600 text-sm">Already have an account?{" "}<span onClick={() => setIsLoginView(true)} className="text-cyan-600 font-semibold cursor-pointer hover:underline">LOGIN</span></p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;

