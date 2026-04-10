import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios'; 
import decorativeImg from '../assets/decorative.jpg';

function RegisterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    gender: '',
    dob: '',
    password: '',
    confirmPassword: '',
    interestLevel: '',
    agreeTerms: false
  });

  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // Sending name, email, password AND username to be safe against 500 errors
      const payload = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        username: formData.username || formData.fullName.split(' ')[0].toLowerCase() 
      };

      await API.post('/auth/register', payload);
      
      // Show the success modal instead of navigating immediately
      setShowModal(true);

    } catch (err) {
      // If you see 500 here, try a brand new email address!
      setError(err.response?.data?.message || 'Server Error. Try a different email or username.');
    }
  };

  const goToLogin = () => {
    setShowModal(false);
    navigate('/login'); // Takes them to the login page as requested
  };

  return (
    <main>
      <section className="section-inner" style={{ paddingTop: '40px' }}>
        <h2 style={{ textAlign: 'center', color: '#d63384', marginBottom: '20px' }}>Sign Up for Updates</h2>
        
        {error && (
          <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px', maxWidth: '500px', margin: '0 auto 20px', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <div className="google-form-wrapper">
          <div className="form-banner">
            <img src={decorativeImg} alt="Registration Banner" />
          </div>

          <form className="registration-form" onSubmit={handleSubmit}>
            <label htmlFor="fullName">Full Name:</label>
            <input type="text" id="fullName" name="fullName" required placeholder="Enter full name" value={formData.fullName} onChange={handleChange} />

            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" required placeholder="Choose a username" value={formData.username} onChange={handleChange} />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required placeholder="example@email.com" value={formData.email} onChange={handleChange} />

            {/* Other visual-only fields */}
            <label htmlFor="gender">Gender:</label>
            <select id="gender" name="gender" required value={formData.gender} onChange={handleChange}>
              <option value="" disabled>Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="non-binary">Non-binary</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>

            <label htmlFor="dob">Date of Birth:</label>
            <input type="date" id="dob" name="dob" required value={formData.dob} onChange={handleChange} />

            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" required placeholder="Min 6 characters" value={formData.password} onChange={handleChange} />

            <label htmlFor="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required placeholder="Repeat password" value={formData.confirmPassword} onChange={handleChange} />

            <p style={{ marginTop: '10px', fontWeight: 'bold' }}>Interest Level:</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              {['Beginner', 'Intermediate', 'Expert'].map(level => (
                <label key={level}>
                  <input type="radio" name="interestLevel" value={level} checked={formData.interestLevel === level} onChange={handleChange} required /> {level}
                </label>
              ))}
            </div>

            <label style={{ marginTop: '15px', display: 'block' }}>
              <input type="checkbox" name="agreeTerms" required checked={formData.agreeTerms} onChange={handleChange} /> I agree to the terms
            </label>

            <button type="submit" style={{ marginTop: '20px' }}>Register</button>
            <p style={{ textAlign: 'center', marginTop: '15px' }}>
              Already have an account? <Link to="/login" style={{ color: '#d63384' }}>Login</Link>
            </p>
          </form>
        </div>
      </section>

      {/* THE UPDATED MODAL */}
      {showModal && (
        <div className="modal" style={{ display: 'flex', backgroundColor: 'rgba(0,0,0,0.7)', position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: 'white', padding: '40px', borderRadius: '15px', textAlign: 'center', maxWidth: '450px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
            <h2 style={{ color: '#4CAF50', marginBottom: '10px' }}>Success!</h2>
            <p style={{ fontSize: '1.1rem', color: '#555' }}>You are now registered for updates.</p>
            <p style={{ marginBottom: '25px' }}>Please log in to your new account to continue.</p>
            <button 
                className="modal-btn" 
                style={{ background: '#d63384', color: 'white', border: 'none', padding: '12px 30px', borderRadius: '25px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem' }} 
                onClick={goToLogin}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

export default RegisterPage;