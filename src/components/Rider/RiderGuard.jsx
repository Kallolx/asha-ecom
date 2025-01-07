import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const RiderGuard = ({ children }) => {
  const { user, userRole } = useAuth();
  
  if (!user) {
    toast.error('Please sign in to access the rider panel');
    return <Navigate to="/" replace />;
  }
  
  if (userRole !== 'rider') {
    toast.error('You do not have permission to access the rider panel');
    return <Navigate to="/" replace />;
  }
  
  return children;
};

export default RiderGuard; 