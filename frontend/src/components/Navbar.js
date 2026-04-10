import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import logo from '../assets/logo.png';

function Navbar({ toggleTheme, themeIcon }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to check if a link is active
  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <header>
      <div className="header-inner">
        <div className="brand" onClick={() => navigate('/home')} style={{ cursor: 'pointer' }}>
          <img src={logo} className="logo" alt="Logo" />
          <span className="brand-text">BL Across Media</span>
        </div>

        <nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <ul>
              {/* Public Links */}
              <li><Link to="/home" className={isActive('/home')}>Home</Link></li>
              <li><Link to="/about" className={isActive('/about')}>About</Link></li>
              <li><Link to="/contact" className={isActive('/contact')}>Contacts</Link></li>
              <li><Link to="/games" className={isActive('/games')}>Games</Link></li>

              {/* Conditional Auth Links */}
              {!user ? (
                <>
                  <li><Link to="/login" className={isActive('/login')}>Login</Link></li>
                  <li><Link to="/register" className={isActive('/register')}>Register</Link></li>
                </>
              ) : (
                <>
                  <li><Link to="/write" className={isActive('/write')}>Write</Link></li>
                  <li><Link to="/profile" className={isActive('/profile')}>Profile</Link></li>
                  {user.role === 'admin' && (
                    <li><Link to="/admin" className={isActive('/admin')}>Admin</Link></li>
                  )}
                  <li>
                    {/* FIXED LOGOUT BUTTON: Matches Nav Bar Style */}
                    <button 
                      onClick={handleLogout} 
                      className="nav-logout-btn"
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'inherit', 
                        cursor: 'pointer',
                        padding: '0',
                        fontSize: 'inherit',
                        fontWeight: 'inherit',
                        fontFamily: 'inherit',
                        opacity: '1',
                        transition: 'opacity 0.3s'
                      }}
                      onMouseEnter={(e) => e.target.style.opacity = '0.7'}
                      onMouseLeave={(e) => e.target.style.opacity = '1'}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>

            {/* Theme Toggle Button */}
            <button 
              onClick={toggleTheme} 
              style={{ 
                background: 'none', 
                border: 'none', 
                cursor: 'pointer', 
                fontSize: '1.2rem',
                display: 'flex',
                alignItems: 'center',
                padding: '5px'
              }}
              title="Toggle Light/Dark Mode"
            >
              {themeIcon}
            </button>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;