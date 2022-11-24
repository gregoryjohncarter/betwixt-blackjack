import React, { useState } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';

function App() {
  const [startGame, setStartGame] = useState(false);
  const [showSuites, setShowSuites] = useState(false);

  const handleStart = () => {
    setShowSuites(true);

    setTimeout(() => {
      setStartGame(true);
    }, 5000)
  }

  return (
    <>
      {!startGame ? 
        <Home startGame={handleStart} showSuites={showSuites}/>
      : 
        <Game/>
      }
    </>
  );
}

export default App;