import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMusic, FaLaughBeam, FaLeaf, FaHandPointUp, FaPen, FaYoutube } from 'react-icons/fa';
import NeuralNetworkCanvas from '../components/NeuralNetwork.jsx';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// --- Animation Variants for the grid ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};

// --- Reusable Resource Card Component ---
const ResourceCard = ({ resource, isCompleted, onComplete }) => {
  const { t } = useTranslation();

  const CardContent = () => (
    <motion.div
      variants={itemVariants}
      className={`relative p-6 rounded-2xl shadow-lg flex flex-col text-center transition-all duration-300 h-full border border-white/20 ${
        isCompleted ? 'bg-green-500/30' : 'bg-white/10 hover:bg-white/20'
      }`}
    >
      <div className="text-5xl mb-4 mx-auto">{resource.icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{resource.title}</h3>
      <p className="text-white/70 text-sm flex-grow">{resource.description}</p>
      {isCompleted && (
        <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
          <span className="text-green-400 font-bold text-lg">{t('completed')}</span>
        </div>
      )}
    </motion.div>
  );

  // Wrap with <a> or <Link>, ensuring onClick marks as complete
  return resource.external ? (
    <a
      href={resource.to}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => onComplete(resource.id)}
    >
      <CardContent />
    </a>
  ) : (
    <Link to={resource.to} onClick={() => onComplete(resource.id)}>
      <CardContent />
    </Link>
  );
};

function Resources() {
  const { t } = useTranslation();
  const [completed, setCompleted] = useState([]);

  const resourcesData = [
    {
      id: 'music',
      to: 'https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0',
      external: true,
      icon: <FaMusic className="text-green-400" />,
      title: t('resources.playlistTitle'),
      description: t('resources.playlistChallenge'),
    },
    {
      id: 'youtube',
      to: 'https://www.youtube.com/watch?v=Rzn_UaM6NfU',
      external: true,
      icon: <FaYoutube className="text-red-400" />,
      title: t('resources.funnyVideoTitle'),
      description: t('resources.funnyVideoChallenge'),
    },
    {
      id: 'jokes',
      to: '/jokes',
      external: false,
      icon: <FaLaughBeam className="text-yellow-400" />,
      title: t('resources.jokesTitle'),
      description: t('resources.jokesChallenge'),
    },
    {
      id: 'exercises',
      to: '/exercises',
      external: false,
      icon: <FaLeaf className="text-blue-400" />,
      title: t('resources.breathingTitle'),
      description: t('resources.breathingChallenge'),
    },
    {
      id: 'bubblewrap',
      to: '/bubblewrap',
      external: false,
      icon: <FaHandPointUp className="text-purple-400" />,
      title: t('resources.stressReliefTitle'),
      description: t('resources.stressReliefChallenge'),
    },
    {
      id: 'journal',
      to: '/my-journey',
      external: false,
      icon: <FaPen className="text-pink-400" />,
      title: t('resources.gratitudeTitle'),
      description: t('resources.gratitudeChallenge'),
    },
  ];

  const handleComplete = (id) => {
    if (!completed.includes(id)) {
      setCompleted([...completed, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-8 relative text-white">
      <NeuralNetworkCanvas />
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl font-bold mb-2">{t('resourcesPageTitle')}</h1>
          <p className="text-white/70 mb-10">{t('resourcesPageDesc')}</p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {resourcesData.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              isCompleted={completed.includes(resource.id)}
              onComplete={handleComplete}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default Resources;
