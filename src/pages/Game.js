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

  const [gameState, setGameState] = useState(gamePhases[0]);

  const shuffleDeck = (array) => {
    let result = [];
    while (array.length) {
      let index = Math.floor(Math.random() * array.length);
      result.push(array[index]);
      array.splice(index, 1);
    }
    return result;
  };

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

  useEffect(() => { // after gameState[0] but before [1]
    if (beginState) {
      setTimeout(() => {  
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
      }, 100);
    }
  }, [beginState]);

  useEffect(() => { // on gameState[1]
    if (gameState === gamePhases[1]) {
      setTimeout(() => {
        const house = document.querySelector('.lean-l');
        house.classList.add('move-l');
        setTimeout(() => {
          const patron = document.querySelector('.lean-r');
          patron.classList.add('move-r');
          setTimeout(() => {
            setGameState(gamePhases[2]);
          }, 2000)
        }, 1000)
      }, 1000);
    }
  }, [gameState])

  return (
    <>
      {/* initilization phase */}
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
      {/* build out gameplay area */}
      {gameState === gamePhases[1] &&
        <div className='home-container'>
          <div className='tiers-stacks transition-from lean-l' data-fade={'Betwixt'}>
            <div className='para-house fly-in-l'>
            </div>
          </div>
          <div className='tiers-stacks transition-from lean-r' data-fade={'Blackjack'}>
            <div className='para-patron fly-in-r'>
            </div>
          </div>
          <div className='tiers-stacks transition-from'>
            <p className='line-1 gradient-text'>
              {suitesString}
            </p>
          </div>
        </div>
      }
      {/* playing board rendered */}
      {gameState === gamePhases[2] &&
        <div className='home-container'>
          <div className='tiers-stacks transition-from move-l' data-fade={'Betwixt'}>
            <div className='para-house'>
            </div>
          </div>
          <div className='tiers-stacks transition-from move-r' data-fade={'Blackjack'}>
            <div className='para-patron'>
            </div>
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