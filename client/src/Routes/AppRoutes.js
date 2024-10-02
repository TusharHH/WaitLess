import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Dashboard from '../Features/Dashboard/Dashboard';
import LoginPage from '../Features/Authentication/Login/LoginPage';
import ServicePage from '../Features/Services/ServicesPage';
import SignupPage from '../Features/Authentication/Signup/SignupPage';
import LandingPage from '../Features/Landing/LandingPage';

import AdminLayout from '../Layout/AdminLayout';
import BookService from '../Features/Services/BookService/BookService';
import Token from '../Features/Token/Token';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/token" element={<Token />} />
      <Route path="/u_dashboard" element={<BookService />} />
      <Route path="/dashboard" element={<AdminLayout><Dashboard /></AdminLayout>} />
      <Route path="/services" element={<AdminLayout><ServicePage /></AdminLayout>} />
    </Routes>
  );
};

export default AppRoutes;
