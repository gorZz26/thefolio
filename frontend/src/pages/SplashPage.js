import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png'; 

function SplashPage() {
    const [progress, setProgress] = useState(0); 
    const [dotCount, setDotCount] = useState(0);
    const [isShattering, setIsShattering] = useState(false);
    const navigate = useNavigate(); 

    useEffect(() => {
        // 1. Session Logic: If already seen, skip to home
        if (sessionStorage.getItem("splashShown")) {
            navigate('/home');
            return;
        }

        // 2. Progress Bar Logic (Fills up in ~5 seconds)
        const progressInterval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(progressInterval);
                    return 100;
                }
                return prev + 5;
            });
        }, 250);

        // 3. Animated Dots Logic (Loading...)
        const dotInterval = setInterval(() => {
            setDotCount((prev) => (prev + 1) % 4);
        }, 500);

        // 4. Shatter Trigger (5 seconds total wait)
        const shatterTimer = setTimeout(() => {
            setIsShattering(true);
            sessionStorage.setItem("splashShown", "true");
            
            // Navigate to home once shards have vanished
            setTimeout(() => navigate('/home'), 2200);
        }, 5000);

        // Cleanup intervals/timers if user leaves early
        return () => {
            clearInterval(progressInterval);
            clearInterval(dotInterval);
            clearTimeout(shatterTimer);
        };
    }, [navigate]);

return (
        <div className="show-splash"> 
            {/* The Loader Section */}
            <div 
                className={`loader-container ${isShattering ? 'fade-out' : ''}`}
                style={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    textAlign: 'center' 
                }}
            >
                <img src={logo} className="logo" alt="Logo" style={{ display: 'block', margin: '0 auto' }} />
                
                <h1 style={{ 
                    color: 'white', 
                    marginTop: '20px', 
                    width: '100%', 
                    textAlign: 'center' 
                }}>
                    BL ACROSS MEDIA
                </h1>

                <div className="progress-wrapper" style={{ margin: '20px auto' }}>
                    <div 
                        className="progress-bar" 
                        style={{ width: `${progress}%` }} 
                    ></div>
                </div>

                <div className="loading-text" style={{ width: '100%', textAlign: 'center' }}>
                    Loading<span>{'.'.repeat(dotCount)}</span>
                </div>
            </div>

            {/* The Shatter Effect */}
            {isShattering && [...Array(100)].map((_, i) => (
                <Shard key={i} logo={logo} /> 
            ))}
        </div>
    );
}

// Sub-component for individual Shards (matches your original JS logic)
function Shard({ logo }) {
    const emojis = ["💗", "🌸", "✨", "🩷", "🌈", "🦋"];
    const isLogo = Math.random() > 0.4;
    
    // Random math for the explosion effect
    const shardStyle = {
        '--x': `${(Math.random() - 0.5) * 1000}px`,
        '--y': `${(Math.random() - 0.5) * 1000}px`,
        '--r': `${Math.random() * 720}deg`,
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        pointerEvents: 'none'
    };

    return (
        <div className="shard" style={shardStyle}>
            {isLogo ? (
                <img src={logo} style={{ width: '30px', height: 'auto' }} alt="shard" />
            ) : (
                <span style={{ fontSize: '24px' }}>
                    {emojis[Math.floor(Math.random() * emojis.length)]}
                </span>
            )}
        </div>
    );
}

export default SplashPage;