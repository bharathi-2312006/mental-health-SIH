// src/components/VideoBackground.jsx

import React from 'react';
import './VideoBackground.css'; // We'll create this CSS file next

const VideoBackground = ({ videoSource }) => {
  return (
    <div className="video-background">
      <video autoPlay loop muted>
        <source src={videoSource} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoBackground;