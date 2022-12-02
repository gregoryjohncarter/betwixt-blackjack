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
    'select-option',
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
    const { card1b, card2b, ...rest } = deckProperties;

    const deck = [];
    Object.keys(rest).forEach((key) => {
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

  const [dealerCards, setDealerCards] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [moveState, setMoveState] = useState('init');

  const dealCards = (moveState) => {
    switch (moveState) {
      case 'player':
        break;
      case 'dealer':
        break;
      default: let cards = deckState;
        cards = cards.slice(0, 4);
        console.log(cards);
        setDealerCards([cards[0], cards[1]]);
        setPlayerCards([cards[2], cards[3]]);
        let dealt = cards;
        cards = deckState;
        setDeckState(cards.filter(filter => {return !dealt.includes(filter)}));
        break;
    }
  }

  const replaceJoker = () => {
    if (dealerCards.includes('card1j')) {
      let cards = dealerCards.filter((filter) => {return filter !== 'card1j'});
      let deck = deckState[0];
      setDealerCards([...cards, deck]);
      setDeckState(deckState.filter((filter) => {return filter !== deck}));
    } else if (playerCards.includes('card1j')) {
      let cards = playerCards.filter((filter) => {return filter !== 'card1j'});
      let deck = deckState[0];
      setPlayerCards([...cards, deck]);
      setDeckState(deckState.filter((filter) => {return filter !== deck}));
    } else {
      return;
    }
  }

  useEffect(() => { // on gameState[3]
    if (gameState === gamePhases[3]) {
      setTimeout(() => {
        // animate border pieces
        const house = document.querySelector('.para-house');
        house.classList.add('width-100');
        const patron = document.querySelector('.para-patron');
        patron.classList.add('width-100');
        setTimeout(() => {
          // div outline fx 1
          const betwixt = document.querySelector('div[data-fade="Betwixt"]');
          betwixt.classList.remove('transition-to');
          // div outline fx 2
          const blackjack = document.querySelector('div[data-fade="Blackjack"]');
          blackjack.classList.remove('transition-to');
          setTimeout(() => {
            // deal cards logic
            dealCards(moveState);
            // next phase is cards on the table -->
            setGameState(gamePhases[4]);
          }, 2000)
        }, 1000)
      }, 100);
    }
  }, [gameState]);

  useEffect(() => { // on gameState[4] 
    if (gameState === gamePhases[4]) {
      setTimeout(() => {
        // deal cards -- unravel effect
        const widthD = document.querySelector('.card-container-d');
        widthD.classList.add('width');
        // ^^
        const widthP = document.querySelector('.card-container-p');
        widthP.classList.add('width');
        setTimeout(() => {
          replaceJoker();
        }, 1000)
      }, 100);
    }
  })

  const [viewportWidth, setViewportWidth] = useState(0);

  useEffect(() => {
    const updateWindowDimensions = () => {
      const vw = window.innerWidth * 0.01;
      document.documentElement.style.setProperty('--vw', `${vw}px`);
      setViewportWidth(vw);
    };
    updateWindowDimensions();
    window.addEventListener("resize", updateWindowDimensions);
  }, []);

  return (
    <>
      {/* initilization phase */}
      {gameState === gamePhases[0] &&
        <div className='page-center page-height'>
          <div className='home-container home-width mix-blend-mode-diff'>
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
          <div className='home-container home-width-2 home-height mix-blend-mode-diff'>
            <div className='tiers-stacks transition-from lean-l' data-fade={'Betwixt'}>
              <div className='card-container-d'>
              </div>
              <div className='para-house fly-in-l'>
                <span className='flip'>C:</span>
              </div>
            </div>
            <div className='tiers-stacks transition-from lean-r' data-fade={'Blackjack'}>
              <div className='para-patron fly-in-r'>
                <span className='flip-2'>U:</span>
              </div>
              <div className='card-container-p'>
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
      {/* fade in deal btn */}
      {gameState === gamePhases[2] &&
        <>
          <div className='page-center page-height'>
            <div className='home-container home-width-2 home-height mix-blend-mode-diff'>
              <div className='tiers-stacks transition-from move-l' data-fade={'Betwixt'}>
                <div className='card-container-d'>
                </div>
                <div className='para-house'>
                  <span className='flip'>C:</span>
                </div>
              </div>
              <div className='tiers-stacks transition-from move-r' data-fade={'Blackjack'}>
                <div className='para-patron'>
                  <span className='flip-2'>U:</span>
                </div>
                <div className='card-container-p'>
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
                <span></span>
              </div>
            </figure>
          </div>
        </>
      }
      {/* deal cards phase */}
      {gameState === gamePhases[3] &&
        <>
          <div className='page-center page-height'>
            <div className='mix-blend-mode-diff home-height pos-absolute home-width-2'>
            </div>
            <div className='home-container home-width-2 home-height pos-absolute'>
              <div className='tiers-stacks transition-from transition-to move-l bg-board play-outline-def' data-fade={'Betwixt'}>
                <div className='card-container-d'>
                </div>
                <div className='para-house width-0'>
                  <span className='flip'>C:</span>
                </div>
              </div>
              <div className='tiers-stacks transition-from transition-to move-r bg-board play-outline-def' data-fade={'Blackjack'}>
                <div className='para-patron width-0'>
                  <span className='flip-2'>U:</span>
                </div>
                <div className='card-container-p'>
                </div>
              </div>
              <div className='tiers-stacks transition-from transition-to bg-board play-outline-def'>
                <p className='line-1 line-2 gradient-text'>
                  {suitesString}
                </p>
              </div>
            </div>
          </div>
        </>
      }
      {/* cards on the table, select option */}
      {gameState === gamePhases[4] &&
        <>
          <div className='page-center page-height'>
            <div className='mix-blend-mode-diff home-height pos-absolute home-width-2'>
            </div>
            <div className='home-container home-width-2 home-height pos-absolute'>
              <div className='tiers-stacks transition-from move-l bg-board play-outline-def' data-fade={'Betwixt'}>
                <div className='card-container-d'>
                  {dealerCards && dealerCards.map((cards, i) => {
                    return <Card imgTag={moveState === ('init' || 'player') && i === 0 && cards.includes(('D' || 'H')) ? 'card2b' : moveState === ('init' || 'player') && i === 0 ? 'card1b' : cards} index={i} key={'d'+String(i)}/>
                  })}
                </div>
                <div className='para-house width-100'>
                  <span className='flip'>C:</span>
                </div>
              </div>
              <div className='tiers-stacks transition-from move-r bg-board play-outline-def' data-fade={'Blackjack'}>
                <div className='para-patron width-100'>
                  <span className='flip-2'>U:</span>
                </div>
                <div className='card-container-p'>
                  {playerCards && playerCards.map((cards, i) => {
                    return <Card imgTag={cards} index={i} key={'p'+String(i)}/>
                  })}
                </div>
              </div>
              <div className='tiers-stacks transition-from transition-to bg-board play-outline-def'>
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