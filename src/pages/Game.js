import React, { useState, useEffect } from 'react';
import source from '../assets/index';

import Card from '../components/Card';

const Game = ({ suitesString }) => {
  // used to track conditional rendering/classes
  // tf = transition from, tt = transition to
  const gamePhases = [
    'init',
    'tf-intro',
    'tt-intro',
    'tf-deal',
    'tt-deal'
  ];

  const [gameState, setGameState] = useState(gamePhases[0])

  const shuffleDeck = (array) => {
    let result = [];
    while (array.length) {
      let index = Math.floor(Math.random() * array.length);
      result.push(array[index]);
      array.splice(index, 1);
    }
    return result;
  };

  // const handleGamePhases = (index) => {
    
  // }

  const [deckState, setDeckState] = useState([]);
  const [beginState, setBeginState] = useState(false);
  
  // first import/shuffle the deck
  useEffect(() => {
    let deckProperties = source;
    delete deckProperties.card1b;
    delete deckProperties.card2b;

    const deck = [];
    Object.keys(deckProperties).forEach((key) => {
      deck.push(key);
    })
    setDeckState(shuffleDeck(deck));
    setBeginState(true);
  }, []);

  console.log(deckState);

  // after init render, but before intro, run some anims 
  useEffect(() => {
    if (beginState) {
      // div outline fx 1 before
      const betwixt = document.querySelector('div[data-fade="Betwixt"]');
      betwixt.classList.add('transition-from');
      betwixt.classList.add('transition-to');
      setTimeout(() => {
        // div outline fx 1 after
        betwixt.classList.remove('transition-to');
        // div outline fx 2 before
        const blackjack = document.querySelector('div[data-fade="Blackjack"]');
        blackjack.classList.add('transition-from');
        blackjack.classList.add('transition-to');
        setTimeout(() => {
          // div outline fx 2 after
          blackjack.classList.remove('transition-to');
          setTimeout(() => {
            // shift to introduction
            setGameState(gamePhases[1]);
          }, 2000)
        }, 1000)
      }, 1000);
    }
  }, [beginState]);

  return (
    <>
      {/* initilization with animations */}
      {gameState === gamePhases[0] &&
        <div className='home-container'>
          <div className='tiers-stacks' data-fade={'Betwixt'}>
          </div>
          <div className='tiers-stacks' data-fade={'Blackjack'}>
          </div>
          <div className='tiers-stacks transition-from'>
            <p className='line-1 gradient-text'>
              {suitesString}
            </p>
          </div>
        </div>
      }
      {/* shift and build out interface for gameplay */}
      {gameState === gamePhases[1] &&
        <div className='home-container'>
          <div className='tiers-stacks transition-from' data-fade={'Betwixt'}>
          </div>
          <div className='tiers-stacks transition-from' data-fade={'Blackjack'}>
          </div>
          <div className='tiers-stacks transition-from'>
            <p className='line-1 gradient-text'>
              {suitesString}
            </p>
          </div>
        </div>
      }
    </>
  )
}

export default Game;