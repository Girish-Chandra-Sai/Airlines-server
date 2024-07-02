// src/components/AdminRoute.jsx
import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const AdminRoute = ({ element }) => {
  const isAdmin = localStorage.getItem('adminToken') === 'admin_logged_in';
  
  return isAdmin ? element : <Navigate to="/login" replace />;
};

export default AdminRoute;