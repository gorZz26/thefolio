import React from 'react';

/**
 * Footer Component
 * This version includes a self-contained style block to force 
 * the footer to the bottom of the screen globally.
 */
function Footer() {
  return (
    <>
      {/* This style block fixes the layout globally just by being rendered */}
      <style>{`
        #root {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
        }
        main, .content-wrapper, .section-inner {
          flex: 1 0 auto;
        }
        footer {
          flex-shrink: 0;
          text-align: center;
          padding: 30px 0;
          width: 100%;
          margin-top: auto;
        }
      `}</style>

      <footer>
        <p style={{ margin: '5px 0', color: '#666', fontSize: '0.9rem' }}>
          Contact: <a href="mailto:placeholder@email.com" style={{ color: '#d63384', textDecoration: 'none' }}>placeholder@email.com</a>
        </p>
        <p style={{ margin: '5px 0', color: '#999', fontSize: '0.8rem' }}>
          &copy; {new Date().getFullYear()} BL Across Media
        </p>
      </footer>
    </>
  );
}

export default Footer;