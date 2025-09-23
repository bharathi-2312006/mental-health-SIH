import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import LanguageSwitcher from './LanguageSwitcher';
import { FaHome, FaQuestionCircle, FaRobot, FaPuzzlePiece, FaUserAstronaut } from 'react-icons/fa';

const Header = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/auth');
    };

    const navLinkClasses = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-lg ${
            isActive ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
        }`;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-white/10">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center space-x-8">
                        {/* Desktop Navigation Links */}
                        <NavLink to="/dashboard" className={navLinkClasses}>
                            <FaHome />
                            <span>{t('home')}</span>
                        </NavLink>
                        <NavLink to="/screening" className={navLinkClasses}>
                            <FaQuestionCircle />
                            <span>{t('screeningTitle')}</span>
                        </NavLink>
                        <NavLink to="/chatbot" className={navLinkClasses}>
                            <FaRobot />
                            <span>{t('aiCoachTitle')}</span>
                        </NavLink>
                        <NavLink to="/resources" className={navLinkClasses}>
                            <FaPuzzlePiece />
                            <span>{t('resourcesTitle')}</span>
                        </NavLink>
                        <NavLink to="/my-journey" className={navLinkClasses}>
                            <FaUserAstronaut />
                            <span>{t('myJourneyTitle')}</span>
                        </NavLink>
                    </div>

                    <div className="flex items-center gap-4">
                        <LanguageSwitcher />
                        <button
                            onClick={handleLogout}
                            className="bg-red-600/80 text-white font-semibold py-2 px-5 rounded-lg hover:bg-red-700 transition-colors"
                        >
                            {t('logout')}
                        </button>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export default Header;
