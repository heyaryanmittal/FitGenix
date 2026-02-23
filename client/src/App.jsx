
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Onboarding from './pages/Onboarding';
import Layout from './components/Layout';
import Home from './pages/Home';
import Exercises from './pages/Exercises';
import Diet from './pages/Diet';
import WorkoutPlans from './pages/WorkoutPlans';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

import Chatbot from './components/Chatbot';

import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <NotificationProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/user-details" element={<Onboarding />} />

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Home />} />
            <Route path="/dashboard/profile" element={<Profile />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/workout-plans" element={<WorkoutPlans />} />
            <Route path="/diet" element={<Diet />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
        <Chatbot />
      </Router>
    </NotificationProvider>
  );
}

export default App;
