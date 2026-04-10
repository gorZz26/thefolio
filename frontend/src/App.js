import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import SplashPage from './pages/SplashPage';
import HomePage from './pages/HomePage';
import PostPage from './pages/PostPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import AdminPage from './pages/AdminPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import GamesPage from './pages/GamesPage';
import Footer from './components/footer';

function App() {
  // 1. Theme Logic (Persistent)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const themeIcon = theme === 'light' ? '🌙' : '☀️';

  return (
    <>
      <Navbar toggleTheme={toggleTheme} themeIcon={themeIcon} />
      <Routes>
        {/* Public Routes */}
        <Route path='/' element={<SplashPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/games' element={<GamesPage />} />
        <Route path='/posts/:id' element={<PostPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route path='/profile' 
          element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        
        {/* FIX: Map BOTH /write and /create-post to the same page */}
        <Route path='/write' 
          element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
        <Route path='/create-post' 
          element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />

        <Route path='/edit-post/:id' 
          element={<ProtectedRoute><EditPostPage /></ProtectedRoute>} />

        {/* Admin Route */}
        <Route path='/admin' 
          element={<ProtectedRoute role='admin'><AdminPage /></ProtectedRoute>} 
        />
      </Routes>
      <Footer />
    </>
  );
}

export default App;