import React, { useState, useEffect, useRef } from 'react';
import { posterData, quoteQuestions, factQuestions, instructions } from '../data/gameData';

// Import Menu Banners
import game1 from '../assets/game1.jpg';
import game2 from '../assets/game2.jpg';
import game3 from '../assets/game3.jpg';
import game4 from '../assets/game4.jpg';
import game5 from '../assets/game5.jpg';

// Import Memory Game Images (Ensure these exist in src/assets)
import la1 from '../assets/la1.png'; import la2 from '../assets/la2.png';
import la3 from '../assets/la3.png'; import la4 from '../assets/la4.png';
import la5 from '../assets/la5.png'; import la6 from '../assets/la6.png';
import la7 from '../assets/la7.png'; import la8 from '../assets/la8.png';
import la9 from '../assets/la9.png'; import la10 from '../assets/la10.png';
import la11 from '../assets/la11.png'; import la12 from '../assets/la12.png';
import la13 from '../assets/la13.png'; import la14 from '../assets/la14.png';
import la15 from '../assets/la15.png'; import la16 from '../assets/la16.png';

const laAssets = [la1, la2, la3, la4, la5, la6, la7, la8, la9, la10, la11, la12, la13, la14, la15, la16];

function GamesPage() {
    const [gameState, setGameState] = useState('menu'); 
    const [activeType, setActiveType] = useState(null);
    const [score, setScore] = useState(0);
    const [currentQ, setCurrentQ] = useState(0);
    const [activePool, setActivePool] = useState([]);
    
    // Tic Tac Toe State
    const [tttBoard, setTttBoard] = useState(Array(9).fill(""));
    const [playerSide, setPlayerSide] = useState("X");
    const [tttActive, setTttActive] = useState(false);
    const [tttStatus, setTttStatus] = useState("");

    // Duo Match State
    const [memoryCards, setMemoryCards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [matched, setMatched] = useState([]);
    const [timer, setTimer] = useState(30);
    const [preview, setPreview] = useState(false);
    const timerRef = useRef(null);

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    // --- GAME ACTIONS ---
    const openInstructions = (type) => {
        setActiveType(type);
        setGameState('instructions');
    };

    const startGame = () => {
        setGameState('playing');
        if (activeType === 'ttt') {
            setTttBoard(Array(9).fill(""));
            setTttActive(false);
            setTttStatus("Select Your Team");
        } else if (activeType === 'memory') {
            setupMemory();
        } else {
            const pool = activeType === 'poster' ? posterData : activeType === 'quote' ? quoteQuestions : factQuestions;
            setActivePool(shuffle([...pool]).slice(0, 10));
            setScore(0);
            setCurrentQ(0);
        }
    };

    // --- TRIVIA LOGIC ---
    const handleAnswer = (choice) => {
        const item = activePool[currentQ];
        const correct = item.correct || item.a;
        if (choice === correct) setScore(prev => prev + 1);
        if (currentQ < 9) setCurrentQ(prev => prev + 1); else setGameState('result');
    };

    // --- TIC TAC TOE LOGIC ---
    const selectTeam = (side) => {
        setPlayerSide(side);
        setTttActive(true);
        setTttStatus("Your Turn!");
        if (side === "O") setTimeout(() => robotMove(Array(9).fill(""), "X"), 600);
    };

    const handleTttClick = (idx) => {
        if (tttBoard[idx] || !tttActive || tttStatus.includes("Robot")) return;
        const newBoard = [...tttBoard];
        newBoard[idx] = playerSide;
        setTttBoard(newBoard);
        if (!checkWinner(newBoard, playerSide)) {
            setTttStatus("Robot is thinking...");
            setTimeout(() => robotMove(newBoard, playerSide === "X" ? "O" : "X"), 600);
        }
    };

    const robotMove = (board, rSide) => {
        const avail = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
        if (avail.length > 0) {
            const move = avail[Math.floor(Math.random() * avail.length)];
            const nextBoard = [...board];
            nextBoard[move] = rSide;
            setTttBoard(nextBoard);
            if (!checkWinner(nextBoard, rSide)) setTttStatus("Your Turn!");
        }
    };

    const checkWinner = (board, side) => {
        const wins = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
        const won = wins.some(c => board[c[0]] !== "" && board[c[0]] === board[c[1]] && board[c[1]] === board[c[2]]);
        if (won) {
            setTttStatus(side === playerSide ? "Winner!" : "Robot Won!");
            setTttActive(false);
            return true;
        }
        if (!board.includes("")) { setTttStatus("Draw!"); setTttActive(false); return true; }
        return false;
    };

    // --- MEMORY LOGIC ---
    const setupMemory = () => {
        let cards = [];
        const ids = shuffle([...Array(8).keys()]);
        ids.forEach(id => {
            cards.push({ id, img: laAssets[id * 2] });
            cards.push({ id, img: laAssets[(id * 2) + 1] });
        });
        setMemoryCards(shuffle(cards));
        setMatched([]);
        setPreview(true);
        setTimeout(() => { setPreview(false); startMemoryTimer(); }, 10000);
    };

    const startMemoryTimer = () => {
        setTimer(30);
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setTimer(t => {
                if (t <= 1) { clearInterval(timerRef.current); setGameState('result'); return 0; }
                return t - 1;
            });
        }, 1000);
    };

    const handleMemoryClick = (idx) => {
        if (preview || flipped.length === 2 || matched.includes(memoryCards[idx].id) || flipped.includes(idx)) return;
        const newFlipped = [...flipped, idx];
        setFlipped(newFlipped);
        if (newFlipped.length === 2) {
            if (memoryCards[newFlipped[0]].id === memoryCards[newFlipped[1]].id) {
                setMatched(prev => [...prev, memoryCards[newFlipped[0]].id]);
                setFlipped([]);
                if (matched.length + 1 === 8) { clearInterval(timerRef.current); setGameState('result'); }
            } else {
                setTimeout(() => setFlipped([]), 800);
            }
        }
    };

    return (
        <main>
            {gameState === 'menu' && (
                <section className="selection-container">
                    <h2 className="selection-title">Select a Game to Play</h2>
                    <div className="game-pyramid-grid">
                        <div className="game-card" onClick={() => openInstructions('poster')}>
                            <div className="poster-frame"><img src={game1} alt="P1" /></div>
                            <h3>Poster Challenge</h3>
                            <p>Guess the title based on the iconic poster!</p>
                        </div>
                        <div className="game-card" onClick={() => openInstructions('quote')}>
                            <div className="poster-frame"><img src={game2} alt="P2" /></div>
                            <h3>Quote Trivia</h3>
                            <p>Identify who said these iconic lines.</p>
                        </div>
                        <div className="game-card" onClick={() => openInstructions('fact')}>
                            <div className="poster-frame"><img src={game3} alt="P3" /></div>
                            <h3>Random BL Facts</h3>
                            <p>Test your general BL knowledge.</p>
                        </div>
                        <div className="game-card" onClick={() => openInstructions('ttt')}>
                            <div className="poster-frame"><img src={game4} alt="P4" /></div>
                            <h3>Tic Tac Toe</h3>
                            <p>Battle the robot: Logo vs. Rainbow!</p>
                        </div>
                        <div className="game-card" onClick={() => openInstructions('memory')}>
                            <div className="poster-frame"><img src={game5} alt="P5" /></div>
                            <h3>Duo Match</h3>
                            <p>Match the iconic BL couples!</p>
                        </div>
                    </div>
                </section>
            )}

            {gameState === 'instructions' && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <h2>Instructions</h2>
                        <div dangerouslySetInnerHTML={{ __html: instructions[activeType] }} />
                        <button className="start-btn" onClick={startGame}>Start Game ✨</button>
                    </div>
                </div>
            )}

            {gameState === 'playing' && (
                <div className="active-zone" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <p className="score-text">
                        {activeType === 'memory' ? (preview ? "Memorize!" : `Time: ${timer}s`) : `Score: ${score} | Q: ${currentQ + 1}/10`}
                    </p>

                    {activeType === 'poster' && activePool[currentQ] && (
                        <div style={{ marginBottom: '20px' }}>
                            <img src={activePool[currentQ].img} className="small-poster" alt="Question" />
                        </div>
                    )}

                    {(activeType === 'poster' || activeType === 'quote' || activeType === 'fact') && activePool[currentQ] && (
                        <>
                            <div className="quote-text-bubble">
                                {activeType === 'poster' ? "Identify this BL:" : activePool[currentQ].q}
                            </div>
                            <div className="options-layout">
                                {activePool[currentQ].choices.map(c => (
                                    <button key={c} className="option-btn" onClick={() => handleAnswer(c)}>{c}</button>
                                ))}
                            </div>
                        </>
                    )}

                    {activeType === 'ttt' && (
                        <div style={{ textAlign: 'center' }}>
                            <h3 className="score-text">{tttStatus}</h3>
                            {!tttActive && (
                                <div style={{ marginBottom: '15px' }}>
                                    <button className="start-btn" onClick={() => selectTeam('X')}>Team Logo ✨</button>
                                    <button className="start-btn" onClick={() => selectTeam('O')} style={{ marginLeft: '10px' }}>Team Rainbow 🌈</button>
                                </div>
                            )}
                            <div className="ttt-board">
                                {tttBoard.map((cell, i) => (
                                    <div key={i} className={`cell ${cell.toLowerCase()}`} onClick={() => handleTttClick(i)}>
                                        {cell === "O" && "🌈"}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeType === 'memory' && (
                        <div className="memory-grid">
                            {memoryCards.map((card, i) => (
                                <div key={i} className={`memory-card ${preview || flipped.includes(i) || matched.includes(card.id) ? 'flipped' : ''}`} onClick={() => handleMemoryClick(i)}>
                                    <img src={card.img} alt="Couple" />
                                </div>
                            ))}
                        </div>
                    )}
                    
                    <button className="exit-btn" onClick={() => {setGameState('menu'); clearInterval(timerRef.current);}}>← Exit</button>
                </div>
            )}

            {gameState === 'result' && (
                <div className="modal" style={{ display: 'flex' }}>
                    <div className="modal-content">
                        <h2>Game Over!</h2>
                        <p>{activeType === 'memory' ? `Couples Found: ${matched.length}/8` : `Final Score: ${score}/10`}</p>
                        <button className="start-btn" onClick={() => setGameState('menu')}>Back to Menu</button>
                    </div>
                </div>
            )}
        </main>
    );
}

export default GamesPage;