import React from 'react';
import { Link } from 'react-router-dom';

const jokes = [
  { joke: "Why did the scarecrow win an award? Because he was outstanding in his field!", gif: "https://media.giphy.com/media/3o7aD3Jt Lorenz/giphy.gif" },
  { joke: "What do you call fake spaghetti? An Impasta!", gif: "https://media.giphy.com/media/uSADiLBYe7k3e/giphy.gif" },
  { joke: "Why don't skeletons fight each other? They don't have the guts.", gif: "https://media.giphy.com/media/QuxqWk7m9ffxyfoa0a/giphy.gif" },
  { joke: "I'm reading a book on anti-gravity. It's impossible to put down!", gif: "https://media.giphy.com/media/3o7btXIElJ58wG0w6I/giphy.gif" },
  { joke: "What did the ocean say to the beach? Nothing, it just waved.", gif: "https://media.giphy.com/media/12hdeiFVeMn0d2/giphy.gif" }
];

function Jokes() {
  return (
    <div className="min-h-screen bg-yellow-50 flex flex-col items-center p-6 sm:p-10">
      <h2 className="text-4xl font-extrabold text-yellow-800 mb-8">A Dose of Laughter 😂</h2>
      <div className="space-y-8 w-full max-w-2xl">
        {jokes.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <p className="text-lg text-gray-700 mb-4">{item.joke}</p>
            <img src={item.gif} alt="Funny GIF" className="mx-auto rounded-lg" />
          </div>
        ))}
      </div>
      <Link to="/resources" className="mt-10 bg-yellow-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-yellow-600 transition">
        ← Back to Boosters
      </Link>
    </div>
  );
}

export default Jokes;