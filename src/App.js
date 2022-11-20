import React, { useState } from 'react';
import Home from './pages/Home';
import Game from './pages/Game';

function App() {
  const [startGame, setStartGame] = useState(false);

  return (
    <>
      {!startGame ? 
        <Home startGame={setStartGame}/>
      : 
        <Game/>
      }
    </>
  );
}

export default App;