import React, { useState, useEffect } from 'react';
import source from '../assets/index';

import Card from '../components/Card';

const Game = ({ suitesString }) => {
  const shuffleDeck = (array) => {
    let result = [];
    while (array.length) {
      let index = Math.floor(Math.random() * array.length);
      result.push(array[index]);
      array.splice(index, 1);
    }
    return result;
  }

  const [deckState, setDeckState] = useState([]);
  const [beginState, setBeginState] = useState(false);
  
  // on game start, init deck
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

  // after init, run some anims 
  useEffect(() => {
    if (beginState) {
      // init anims
      const start = document.querySelector('.start');
      start.classList.remove('start');
      setTimeout(() => {
        start.classList.remove('fill-in');
        start.classList.remove('transition-to');
        setTimeout(() => {
          const betwixt = document.querySelector('div[data-fade="Betwixt"]');
          betwixt.classList.add('transition-from');
          betwixt.classList.add('fill-in');
          betwixt.classList.add('transition-to');
          setTimeout(() => {
            betwixt.classList.remove('fill-in');
            betwixt.classList.remove('transition-to');
            const blackjack = document.querySelector('div[data-fade="Blackjack"]');
            blackjack.classList.add('transition-from');
            blackjack.classList.add('fill-in');
            blackjack.classList.add('transition-to');
            setTimeout(() => {
              blackjack.classList.remove('fill-in');
              blackjack.classList.remove('transition-to');
            }, 750)
          }, 750)
        }, 750)
      }, 3000);
    }
  }, [beginState])

  console.log(deckState);

  return (
    <>
      <div className='home-container'>
        <div className='tiers-stacks' data-fade={'Betwixt'}>
        </div>
        <div className='tiers-stacks' data-fade={'Blackjack'}>
        </div>
        <div className='tiers-stacks start transition-from transition-to fill-in'>
          <p className="line-1 gradient-text">
            {suitesString}
          </p>
        </div>
      </div>
    </>
  )
}

export default Game;