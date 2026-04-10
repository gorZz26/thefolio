import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import decorativeImg from '../assets/decorative.jpg'; // Using your consistent banner

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      // FIX: Passing as an object { email, password } matches 
      // the updated AuthContext.js login(credentials) function.
      const user = await login({ email, password });

      if (user) {
        // Instant redirect based on role
        navigate(user.role === 'admin' ? '/admin' : '/home');
      }
    } catch (err) {
      // Captures the 400/401 errors from the backend
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    }
  };

  return (
    <main>
      <section className="section-inner" style={{ paddingTop: '60px' }}>
        <h2 style={{ textAlign: 'center', color: '#d63384', marginBottom: '20px' }}>
          Welcome Back
        </h2>

        <div className="google-form-wrapper" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div className="form-banner">
            <img src={decorativeImg} alt="Login Banner" />
          </div>

          <form className="registration-form" onSubmit={handleSubmit}>
            <div className="form-intro">
              <p>Log in to access your profile, write posts, and see the latest updates.</p>
            </div>

            {/* Error Message Display */}
            {error && (
              <div style={{ 
                color: '#721c24', 
                backgroundColor: '#f8d7da', 
                padding: '10px', 
                borderRadius: '5px', 
                marginBottom: '15px',
                fontSize: '14px'
              }}>
                {error}
              </div>
            )}

            <label htmlFor="email">Email Address:</label>
            <input 
              type="email" 
              id="email"
              placeholder="example@email.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />

            <label htmlFor="password">Password:</label>
            <input 
              type="password" 
              id="password"
              placeholder="Enter your password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />

            <button type="submit" style={{ marginTop: '20px' }}>
              Login
            </button>

            <p style={{ textAlign: 'center', marginTop: '20px' }}>
              Don't have an account? <Link to="/register" style={{ color: '#d63384', fontWeight: 'bold' }}>Sign up here</Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;