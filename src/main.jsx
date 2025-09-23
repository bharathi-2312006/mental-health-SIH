import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import './i18n'; // Import the i18next configuration

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Add Suspense for translations to load */}
    <Suspense fallback="Loading...">
      <App />
    </Suspense>
  </React.StrictMode>,
);