import React, { useState } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';

function App() {
  const [startGame, setStartGame] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [showSuites, setShowSuites] = useState(false);

  // start sequence - 1. disable button 2. start animations 3. switch pages
  const handleStart = () => {
    setToggle(false);
    setShowSuites(true);
    setTimeout(() => {
      setStartGame(true);
    }, 11000)
  };

  // provide randomized suites string
  const [suitesString, setSuitesString] = useState('');

  return (
    <>
      {!startGame ? 
        <Home 
          startGame={handleStart} 
          showSuites={showSuites} 
          suitesString={suitesString} 
          setSuitesString={setSuitesString}
          toggle={toggle}
        />
      : 
        <Game 
          suitesString={suitesString}
        />
      }
    </>
  )
}

export default App;