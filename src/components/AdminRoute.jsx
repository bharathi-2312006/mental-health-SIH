// src/components/AdminRoute.jsx

import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // Make sure you export 'db' from firebase.js
import { doc, getDoc } from "firebase/firestore";

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const user = auth.currentUser;
      if (user) {
        // Get the user's role from their document in the 'users' collection
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().role === 'admin') {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        checkAdminStatus();
      } else {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return isAdmin ? children : <Navigate to="/dashboard" />;
};

export default AdminRoute;