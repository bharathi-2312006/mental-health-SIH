import React from 'react';
import { Link } from 'react-router-dom';
import './Exercises.css'; // We'll create this file next for the animation

function Exercises() {
  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center p-6 sm:p-10">
      <h2 className="text-4xl font-extrabold text-blue-800 mb-8">Relaxation Exercises 🧘</h2>
      <div className="space-y-8 w-full max-w-3xl">
        {/* Box Breathing */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-blue-700 mb-3">Box Breathing</h3>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="box-breathing-visual">
              <span className="box-breathing-text">Breathe</span>
            </div>
            <p className="text-gray-700">
              This technique helps calm your nervous system.
              <br/> <strong>1. Inhale</strong> for 4 seconds.
              <br/> <strong>2. Hold</strong> your breath for 4 seconds.
              <br/> <strong>3. Exhale</strong> for 4 seconds.
              <br/> <strong>4. Hold</strong> again for 4 seconds. Repeat.
            </p>
          </div>
        </div>
        {/* Progressive Muscle Relaxation */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-2xl font-bold text-blue-700 mb-3">Progressive Muscle Relaxation</h3>
          <p className="text-gray-700">
            Find a quiet place to sit. For each body part below, tense the muscles tightly for 5 seconds, then release the tension and relax for 10 seconds.
            <br/><br/> • Start with your <strong>feet and toes</strong>.
            <br/> • Move up to your <strong>legs</strong>.
            <br/> • Continue with your <strong>stomach and chest</strong>.
            <br/> • Tense your <strong>arms and hands</strong>.
            <br/> • Finish with your <strong>neck and face</strong>.
          </p>
        </div>
      </div>
      <Link to="/resources" className="mt-10 bg-blue-500 text-white font-semibold py-2 px-6 rounded-full shadow-md hover:bg-blue-600 transition">
        ← Back to Boosters
      </Link>
    </div>
  );
}

export default Exercises;