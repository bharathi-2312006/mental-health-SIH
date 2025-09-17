import React, { useState } from 'react';
import { Link } from 'react-router-dom';

// REMOVED: The line importing popSound has been deleted to fix the error.
// import popSound from '../assets/pop.mp3'; 

// REMOVED: The line creating the audio object is also gone.
// const audio = new Audio(popSound);

// --- Bubble Component ---
const Bubble = ({ isPopped, onPop }) => (
  <button
    onClick={onPop}
    aria-label="Pop bubble"
    className={`w-12 h-12 rounded-full m-1 transition-transform duration-100 transform
                ${isPopped 
                  ? 'bg-purple-200 scale-90' 
                  : 'bg-purple-500 hover:bg-purple-600 active:scale-95 shadow-lg'
                }`}
  />
);

function BubbleWrap() {
  const TOTAL_BUBBLES = 150;
  const [popped, setPopped] = useState(new Set());

  const handlePop = (index) => {
    if (popped.has(index)) return;

    // REMOVED: The lines that played the sound are gone.
    // audio.currentTime = 0;
    // audio.play();
    
    // The visual "pop" still works by updating the state.
    const newPopped = new Set(popped);
    newPopped.add(index);
    setPopped(newPopped);
  };

  const handleReset = () => {
    setPopped(new Set());
  };

  return (
    <div className="min-h-screen bg-purple-50 flex flex-col items-center p-4">
      <h2 className="text-3xl font-extrabold text-purple-800 my-6">Pop Away Your Stress!</h2>
      <div 
        className="grid gap-1 justify-center"
        style={{ gridTemplateColumns: 'repeat(10, auto)'}}
      >
        {[...Array(TOTAL_BUBBLES)].map((_, i) => (
          <Bubble
            key={i}
            isPopped={popped.has(i)}
            onPop={() => handlePop(i)}
          />
        ))}
      </div>
      <div className="mt-6 flex gap-4">
        <button onClick={handleReset} className="bg-purple-600 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-purple-700 transition">
          Reset
        </button>
        <Link to="/resources" className="bg-gray-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-gray-600 transition">
          ← Back
        </Link>
      </div>
    </div>
  );
}

export default BubbleWrap;