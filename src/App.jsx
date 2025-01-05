import React, { useState, useRef, useEffect } from 'react';
    import confetti from 'canvas-confetti';

    function EmojiGrid({ visible }) {
      const [gridSize, setGridSize] = useState({ rows: 0, cols: 0 });

      useEffect(() => {
        const calculateGridSize = () => {
          const screenWidth = window.innerWidth;
          const screenHeight = window.innerHeight;
          const emojiSize = 50;
          const cols = Math.ceil(screenWidth / emojiSize);
          const rows = Math.ceil(screenHeight / emojiSize);
          setGridSize({ rows, cols });
        };

        calculateGridSize();
        window.addEventListener('resize', calculateGridSize);
        return () => window.removeEventListener('resize', calculateGridSize);
      }, []);

      if (!visible) return null;

      const emojis = [];
      for (let i = 0; i < gridSize.rows; i++) {
        for (let j = 0; j < gridSize.cols; j++) {
          emojis.push(<span key={`${i}-${j}`} style={{ fontSize: '50px' }}>👎</span>);
        }
      }

      return (
        <div className="emoji-grid" style={{ gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)` }}>
          {emojis}
        </div>
      );
    }


    function SlotMachine() {
      const [result, setResult] = useState(['', '', '']);
      const [balance, setBalance] = useState(100);
      const symbols = ['🍒', '🍊', '🍋', '🍉', '🍇'];
      const canvasRef = useRef(null);
      const [emojiGridVisible, setEmojiGridVisible] = useState(false);

      const spin = () => {
        if (balance <= 0) {
          alert("You don't have enough balance to spin!");
          return;
        }
        setBalance(prevBalance => prevBalance - 10);
        const newResult = Array(3).fill().map(() => symbols[Math.floor(Math.random() * symbols.length)]);
        setResult(newResult);
        checkWin(newResult);
      };

      const checkWin = (newResult) => {
        if (newResult[0] === newResult[1] && newResult[1] === newResult[2]) {
          setBalance(prevBalance => prevBalance + 50);
          triggerConfetti();
          alert('You won!');
        }
      };

      const addBalance = () => {
        setEmojiGridVisible(true);
        setTimeout(() => setEmojiGridVisible(false), 1000);
        setBalance(prevBalance => prevBalance + 100);
      };

      const triggerConfetti = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const myConfetti = confetti.create(canvas, {
          resize: true,
          useWorker: true
        });

        myConfetti({
          particleCount: 200,
          spread: 160,
          origin: { y: 0.7 }
        });
      };


      return (
        <div className="slot-machine">
          <canvas ref={canvasRef} style={{ position: 'absolute', pointerEvents: 'none', top: 0, left: 0, width: '100%', height: '100%' }}></canvas>
          <EmojiGrid visible={emojiGridVisible} />
          <div className="slot-display">{result.join(' ')}</div>
          <button className="spin-button" onClick={spin}>Spin</button>
          <div className="balance">Balance: ${balance}</div>
          <button className="add-balance-button" onClick={addBalance}>Add Balance</button>
        </div>
      );
    }

    function App() {
      return (
        <div className="casino-container">
          <h1>Casino</h1>
          <SlotMachine />
        </div>
      );
    }

    export default App;
