import { useState, useEffect } from "react";
// 1. Import BrowserRouter
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaGoogle, FaEye, FaEyeSlash, FaFacebook, FaGlobe } from 'react-icons/fa';
import LoginAnimation from './components/LoginAnimation.jsx';
import { useTranslation } from 'react-i18next'; // Use the new hook

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
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, signInWithEmailAndPassword, onAuthStateChanged, signOut, browserPopupRedirectResolver } from "firebase/auth";
import { motion, AnimatePresence } from 'framer-motion';

// --- Main App Component ---
function App() {
  return (
    // 2. Wrap the entire application in the Router
    <Router>
      <AuthGate />
    </Router>
  );
}

// --- Component to handle Authentication vs. Main App ---
function AuthGate() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  return (
    <Routes>
      {user ? (
        // Routes for logged-in users
        <>
          <Route path="/dashboard" element={<Dashboard onLogout={() => signOut(auth)} />} />
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
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </>
      ) : (
        // Route for logged-out users
        <>
          <Route path="/auth" element={<AuthScreen />} />
          <Route path="*" element={<Navigate to="/auth" />} />
        </>
      )}
    </Routes>
  );
}


// --- Component for the Login/Signup UI ---
function AuthScreen() {
    const { t, i18n } = useTranslation();
    const [isLoginView, setIsLoginView] = useState(true);
    const [showPassword, setShowPassword] = useState(false);

    // Auth handlers
    const handleSignup = async (e) => { e.preventDefault(); const fullName = e.target.fullName.value; const email = e.target.email.value; const password = e.target.password.value; try { const userCredential = await createUserWithEmailAndPassword(auth, email, password); await updateProfile(userCredential.user, { displayName: fullName }); } catch (err) { alert(err.message); } };
    const handleEmailLogin = async (e) => { e.preventDefault(); const email = e.target.email.value; const password = e.target.password.value; try { await signInWithEmailAndPassword(auth, email, password); } catch (err) { alert(err.message); } };
    const handleGoogleLogin = async () => { try { await signInWithPopup(auth, googleProvider, browserPopupRedirectResolver); } catch (err) { console.error("Google Login Error:", err); alert(err.message); } };
    const handleFacebookLogin = async () => { try { await signInWithPopup(auth, facebookProvider, browserPopupRedirectResolver); } catch (err) { alert(err.message); } };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
            <LoginAnimation />
            <div className="relative z-10 w-full max-w-sm">
                <div className="absolute -top-14 right-0">
                    <LanguageSelector />
                </div>
                <AnimatePresence mode="wait">
                    {isLoginView ? (
                        <motion.div key="login" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                            <AuthCard>
                                <div className="flex justify-center mb-4"><div className="bg-gradient-to-br from-purple-500 to-indigo-600 p-5 rounded-full shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A4 4 0 0112 15a4 4 0 016.879 2.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg></div></div>
                                <h1 className="text-3xl font-bold mb-6 text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">{t('welcome')}</h1>
                                <form className="space-y-6" onSubmit={handleEmailLogin}>
                                    <AuthInput type="email" name="email" placeholder={t('email')} icon={<FaUser />} />
                                    <AuthInput type={showPassword ? "text" : "password"} name="password" placeholder={t('password')} icon={<FaLock />} eyeIcon={showPassword ? <FaEyeSlash /> : <FaEye />} onEyeClick={() => setShowPassword(!showPassword)} />
                                    <button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg">{t('login')}</button>
                                </form>
                                <p className="mt-6 text-gray-400 text-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">{t('orSignInWith')}</p>
                                <div className="flex justify-center gap-6 mt-4"><SocialButton onClick={handleGoogleLogin} aria-label="Login with Google"><FaGoogle /></SocialButton><SocialButton onClick={handleFacebookLogin} aria-label="Login with Facebook"><FaFacebook /></SocialButton></div>
                                <p className="mt-6 text-gray-300 text-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">{t('noAccount')}{" "}<button onClick={() => setIsLoginView(false)} className="text-indigo-400 font-semibold hover:underline">{t('signup')}</button></p>
                            </AuthCard>
                        </motion.div>
                    ) : (
                        <motion.div key="signup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
                            <AuthCard>
                                <div className="flex justify-center mb-4"><div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-5 rounded-full shadow-lg"><svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg></div></div>
                                <h1 className="text-3xl font-bold text-white mb-6 [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">{t('createAccount')}</h1>
                                <form className="space-y-6" onSubmit={handleSignup}>
                                    <AuthInput type="text" name="fullName" placeholder={t('fullName')} icon={<FaUser />} />
                                    <AuthInput type="email" name="email" placeholder={t('email')} icon={<FaEnvelope />} />
                                    <AuthInput type="password" name="password" placeholder={t('password')} icon={<FaLock />} />
                                    <button type="submit" className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:opacity-90 transition shadow-lg">{t('signup')}</button>
                                </form>
                                <p className="mt-8 text-gray-300 text-sm [text-shadow:0_1px_2px_rgba(0,0,0,0.5)]">{t('haveAccount')}{" "}<button onClick={() => setIsLoginView(true)} className="text-cyan-400 font-semibold hover:underline">{t('login')}</button></p>
                            </AuthCard>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}


// --- Reusable UI Components for the "Floating" design ---
const AuthCard = ({ children }) => (
  // The card is now completely transparent
  <div className="p-8 sm:p-10 text-center">
    {children}
  </div>
);
const AuthInput = ({ icon, eyeIcon, onEyeClick, ...props }) => (
  // The input is now a line instead of a box
  <div className="relative">
    <span className="absolute left-0 top-3.5 text-gray-400">{icon}</span>
    <input 
      {...props}
      className="w-full px-4 py-3 pl-8 bg-transparent border-b border-white/30 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 transition"
      required 
    />
    {eyeIcon && (
      <span onClick={onEyeClick} className="absolute right-0 top-3.5 text-gray-400 cursor-pointer">
        {eyeIcon}
      </span>
    )}
  </div>
);
const SocialButton = ({ children, ...props }) => (
  // The social buttons are now more subtle circles
  <button {...props} className="text-2xl text-white/70 hover:text-white transition transform hover:scale-110">
    {children}
  </button>
);
function LanguageSelector() {
    const { i18n } = useTranslation();
    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div className="relative">
            <select 
                value={i18n.language} 
                onChange={handleLanguageChange}
                className="bg-black/30 backdrop-blur-md border border-white/20 text-white text-sm rounded-lg pl-8 pr-2 py-1 appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
                <option value="en">English</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="ur">اردو (Urdu)</option>
                <option value="ks">کٲشُر (Kashmiri)</option>
            </select>
            <FaGlobe className="absolute top-1/2 left-2 -translate-y-1/2 text-white/70 pointer-events-none" />
        </div>
    );
}

export default App;

