import React from 'react';
import { Link } from 'react-router-dom';
import { FaMusic, FaYoutube, FaGrinBeam, FaLeaf, FaHandPointUp, FaPen } from 'react-icons/fa';

// Card component is simplified as we'll handle links outside of it
const Card = ({ icon, title, description, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-center transition-transform transform hover:-translate-y-2 h-full">
    <div className="text-5xl mb-4 text-gray-500">{icon}</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
    <p className="text-gray-600 mb-4 flex-grow">{description}</p>
    {children}
  </div>
);

function Resources() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-6 sm:p-10">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-2">Mental Health Boosters ✨</h2>
      <p className="text-gray-500 mb-10">Quick and fun tasks to brighten your day!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
        {/* Spotify Card */}
        <Card icon={<FaMusic className="text-green-500"/>} title="Feel-Good Playlist" description="Listen to some happy tunes on Spotify to lift your spirits and boost your mood instantly.">
          <a href="https://open.spotify.com/playlist/37i9dQZF1DX3rxVfibe1L0" target="_blank" rel="noopener noreferrer" className="mt-auto text-white font-semibold py-2 px-5 rounded-full shadow-md bg-green-500 hover:bg-green-600 transition-all">
            Play Music
          </a>
        </Card>

        {/* YouTube Card */}
        <Card icon={<FaYoutube className="text-red-500"/>} title="Watch a Funny Video" description="Laughter is the best medicine. Watch a short, funny video to get a quick dose of happiness.">
          <a href="https://www.youtube.com/watch?v=Rzn_UaM6NfU" target="_blank" rel="noopener noreferrer" className="mt-auto text-white font-semibold py-2 px-5 rounded-full shadow-md bg-red-500 hover:bg-red-600 transition-all">
            Watch Now
          </a>
        </Card>
        
        {/* Jokes Card - NOW A LINK */}
        <Link to="/jokes" className="h-full">
          <Card icon={<FaGrinBeam className="text-yellow-500"/>} title="Quick Laugh" description="Feeling down? Click here for a collection of jokes and funny GIFs to bring a smile to your face." />
        </Link>
        
        {/* Breathing Card - NOW A LINK */}
        <Link to="/exercises" className="h-full">
          <Card icon={<FaLeaf className="text-blue-500"/>} title="Relaxation Exercises" description="Learn simple but powerful techniques like Box Breathing to calm your mind and reduce stress." />
        </Link>

        {/* Bubble Wrap Card - NOW A LINK */}
        <Link to="/bubblewrap" className="h-full">
          <Card icon={<FaHandPointUp className="text-purple-500"/>} title="Digital Bubble Wrap" description="Pop some virtual bubble wrap for some oddly satisfying stress relief. Click, pop, and relax." />
        </Link>
        
        {/* Gratitude Card */}
        <Card icon={<FaPen className="text-pink-500"/>} title="Gratitude Moment" description="Grab a pen or open a notes app. Quickly write down three small things you're grateful for right now." />
      </div>
    </div>
  );
}

export default Resources;