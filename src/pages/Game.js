import React, { useState, useEffect } from 'react';
import source from '../assets/index';

import Card from '../components/Card';

const Game = ({ suitesString }) => {
  // used to track conditional rendering/classes
  const gamePhases = [
    'init',
    'intro',
    'deal-btn',
    'deal-cards',
    'play'
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
        // adjust panel dimensions
        const home = document.querySelector('.home-container');
        home.classList.remove('home-width');
        home.classList.add('home-width-2');
        home.classList.add('home-height');
        // shift suites to realign
        const line = document.querySelector('.line-1');
        line.classList.add('line-2');
        setTimeout(() => {
          // div outline fx 1 before
          const betwixt = document.querySelector('div[data-fade="Betwixt"]');
          betwixt.classList.add('transition-to');
          setTimeout(() => {
            // div outline fx 1 after
            betwixt.classList.remove('transition-to');
            // div outline fx 2 before
            const blackjack = document.querySelector('div[data-fade="Blackjack"]');
            blackjack.classList.add('transition-to');
            setTimeout(() => {
              // div outline fx 2 after
              blackjack.classList.remove('transition-to');
                setTimeout(() => {
                  // shift to introduction
                  setGameState(gamePhases[1]);
                }, 1000)
            }, 1000)
          }, 1000)
        }, 2000)
      }, 100);
    }
  }, [beginState]);

  useEffect(() => { // on gameState[1]
    if (gameState === gamePhases[1]) {
      setTimeout(() => {
        // dock style shift
        const house = document.querySelector('.lean-l');
        house.classList.add('move-l');
        const patron = document.querySelector('.lean-r');
        patron.classList.add('move-r');
        setTimeout(() => {
          setGameState(gamePhases[2]);
        }, 2000)
      }, 1000);
    }
  }, [gameState])

  const handleDealButton = () => {
    const figure = document.querySelector('figure');
    figure.classList.remove('figure-hover');
    const deal = document.querySelector('figure div');
    deal.classList.add('btn-flip');
    deal.classList.add('fade-out');
    setTimeout(() => {
      setGameState(gamePhases[3]);
    }, 1000);
  }

  return (
    <>
      {/* initilization phase */}
      {gameState === gamePhases[0] &&
        <div className='page-center page-height'>
          <div className='home-container home-width'>
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
        </div>
      }
      {/* build out gameplay area */}
      {gameState === gamePhases[1] &&
        <div className='page-center page-height'>
          <div className='home-container home-width-2 home-height'>
            <div className='tiers-stacks transition-from lean-l' data-fade={'Betwixt'}>
              <div className='para-house fly-in-l'>
                <span className='flip'>C:</span>
              </div>
            </div>
            <div className='tiers-stacks transition-from lean-r' data-fade={'Blackjack'}>
              <div className='para-patron fly-in-r'>
                <span className='flip-2'>U:</span>
              </div>
            </div>
            <div className='tiers-stacks transition-from'>
              <p className='line-1 line-2 gradient-text'>
                {suitesString}
              </p>
            </div>
          </div>
        </div>
      }
      {/* playing board rendered */}
      {gameState === gamePhases[2] &&
        <>
          <div className='page-center page-height'>
            <div className='home-container home-width-2 home-height'>
              <div className='tiers-stacks transition-from move-l' data-fade={'Betwixt'}>
                <div className='para-house'>
                  <span className='flip'>C:</span>
                </div>
              </div>
              <div className='tiers-stacks transition-from move-r' data-fade={'Blackjack'}>
                <div className='para-patron'>
                  <span className='flip-2'>U:</span>
                </div>
              </div>
              <div className='tiers-stacks transition-from'>
                <p className='line-1 line-2 gradient-text'>
                  {suitesString}
                </p>
              </div>
            </div>
          </div>
          <div className='deal-container fade-in'>
            <figure className='figure-hover' onClick={() => { handleDealButton() }}>
              <div>
                <span>Deal</span>
                <span>Begin</span>
              </div>
            </figure>
          </div>
        </>
      }
      {/* deal cards phase */}
      {gameState === gamePhases[3] &&
        <>
          <div className='page-center page-height'>
            <div className='home-container home-width-2 home-height'>
              <div className='tiers-stacks transition-from move-l' data-fade={'Betwixt'}>
                <div className='para-house'>
                  <span className='flip'>C:</span>
                </div>
              </div>
              <div className='tiers-stacks transition-from move-r' data-fade={'Blackjack'}>
                <div className='para-patron'>
                  <span className='flip-2'>U:</span>
                </div>
              </div>
              <div className='tiers-stacks transition-from'>
                <p className='line-1 line-2 gradient-text'>
                  {suitesString}
                </p>
              </div>
            </div>
          </div>
        </>
      }
    </>
  )
}

export default Game;