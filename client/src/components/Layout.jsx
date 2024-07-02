// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ setIsLoggedIn }) => {
  return (
    <>
      <Navbar setIsLoggedIn={setIsLoggedIn} />
      <Outlet />
    </>
  );
};

export default Layout;