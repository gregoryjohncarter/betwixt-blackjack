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
  }, [gameState]);

  const handleDealButton = () => {
    const figure = document.querySelector('figure');
    figure.classList.remove('figure-hover');
    const deal = document.querySelector('figure div');
    deal.classList.add('btn-flip');
    deal.classList.add('fade-out');
    setTimeout(() => {
      setGameState(gamePhases[3]);
    }, 1000);
  };

  const [dealerCards, setDealerCards] = useState([]);
  const [playerCards, setPlayerCards] = useState([]);
  const [moveState, setMoveState] = useState('init');

  const dealCards = (moveState) => {
    switch (moveState) {
      case 'player':
        let cards = deckState;
        cards = cards.slice(0, 1);
        let player = [...playerCards];
        player.push(cards[0]);
        setPlayerCards(player);
        let justDealt = cards;
        setDeckState(prevDeck => prevDeck.filter(filter => {return !justDealt.includes(filter)}));
        break;
      case 'dealer':
        let deck = deckState;
        deck = deck.slice(0, 1);
        let dealer = [...dealerCards];
        dealer.push(deck[0]);
        setDealerCards(dealer);
        let newCard = deck;
        setDeckState(prevDeck => prevDeck.filter(filter => {return !newCard.includes(filter)}));
        break;
      default:
        let fourCards = deckState;
        fourCards = fourCards.slice(0, 4);
        setDealerCards([fourCards[0], fourCards[1]]);
        setPlayerCards([fourCards[2], fourCards[3]]);
        let dealt = fourCards;
        setDeckState(prevDeck => prevDeck.filter(filter => {return !dealt.includes(filter)}));
        break;
    }
  };

  const replaceJoker = (playerTurn) => {
    if (dealerCards.includes('card1j')) {
      var cards = null;
      if (playerTurn === 'init') {
        cards = [dealerCards[1]].filter((filter) => {return filter !== 'card1j'});
      } else {
        cards = dealerCards.filter((filter) => {return filter !== 'card1j'});
      }
      let deck = deckState[0];
      setDealerCards([...cards, deck]);
      setDeckState(deckState.filter((filter) => {return filter !== deck}));
    } else if (playerCards.includes('card1j')) {
      let cards = playerCards.filter((filter) => {return filter !== 'card1j'});
      let deck = deckState[0];
      setPlayerCards([...cards, deck]);
      setDeckState(deckState.filter((filter) => {return filter !== deck}));
    }
  };

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
          }, 2500)
        }, 1500)
      }, 100);
    }
  }, [gameState]);

  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);

  const countScore = (moveState) => {
    const playerCount = (select) => {
      if (!dealerCards.length || !playerCards.length) {
        return;
      }
      let score = 0;
      var cards = 0;
      if (select === 'player') {
        cards = [...playerCards];
      } else {
        cards = [...dealerCards];
      }
      // account for only one card up if init (dealer count)
      if (select === 'init' && cards.length > 1) {
        let faceUp = cards[1];
        var array = faceUp.split('');
        if (faceUp.match(/\d+/)) {
          let val = faceUp.match(/\d+/)[0];
          val = Number(val);
          score += val;
        } else if (array.includes('A')) {
          let val = 11;
          score += val;
        } else if (array.includes('J') || array.includes('Q') || array.includes('K') || array.includes('T')) {
          let val = 10;
          score += val;
        }
        setScore2(score);
        return;
      }
      cards.forEach((card) => {
        var array = card.split('');
        if (card.match(/\d+/)) {
          let val = card.match(/\d+/)[0];
          val = Number(val);
          score += val;
        } else if (array.includes('A')) {
          let val = 11;
          score += val;
        } else if (array.includes('J') || array.includes('Q') || array.includes('K') || array.includes('T')) {
          let val = 10;
          score += val;
        }
      });
      if (select === 'player') {
        setScore1(score);
      } else {
        setScore2(score);
      }
    }
    if (moveState === 'init' && playerCards.length && dealerCards.length) {
      playerCount('player');
      playerCount('init');
      return;
    } else if (moveState === 'player') {
      playerCount('player');
      return;
    } else if (moveState === 'dealer') {
      playerCount('dealer');
      return;
    } else {
      return;
    }
  };

  useEffect(() => {
    if (playerCards.length && dealerCards.length) {
      countScore(moveState);
    }
  }, [playerCards, dealerCards]);

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
          replaceJoker(moveState);
          setTimeout(() => {
            // pop up selections
            const hit = document.querySelector('.hit-container');
            hit.classList.add('out-l');
            const stand = document.querySelector('.stand-container');
            stand.classList.add('out-r');
          }, 3000)
        }, 1000)
      }, 100);
    }
  }, [gameState]);

  const [actionCooldown, setActionCooldown] = useState(false);
  // triggers when an action is pushed, and then reverts after timeout
  const handleCooldown = () => {
    setActionCooldown(true);
    setTimeout(() => {
      setActionCooldown(false);
    }, 3000);
  };

  const handleActionPush = (action) => {
    if (actionCooldown) {
      return;
    }
    if (action === 'init-hit') {
      setMoveState('player');
      setGameState(gamePhases[5]);
    } else if (action === 'init-stand') {
      setMoveState('dealer');
      setGameState(gamePhases[5]);
    } else if (action === 'hit') {
      setMoveState('player');
      dealCards('player');
      handleCooldown();
      setTimeout(() => {
        replaceJoker(moveState);
      }, 1000);
    } else if (action === 'stand') {
      setMoveState('dealer');
      dealCards('dealer');
      handleCooldown();
      setTimeout(() => {
        replaceJoker(moveState);
      }, 1000);
    } else {
      return;
    }
  }

  // changes/removes fade in from the animation for counting score
  const [scorePhase, setScorePhase] = useState(false);

  useEffect(() => { // on gameState[5] 
    if (gameState === gamePhases[5]) {
      handleCooldown();
      if (moveState === 'player') {
        dealCards('player');
        setTimeout(() => {
          replaceJoker(moveState);
        }, 1000);
      } else {
        dealCards('dealer');
        setTimeout(() => {
          replaceJoker(moveState);
        }, 1000);
      }
      setScorePhase(true);
    }
  }, [gameState]);

  // handle card overlap for smaller screens
  const [stackLeft, setStackLeft] = useState(false);
  const [stackRight, setStackRight] = useState(false);

  useEffect(() => {
    if (playerCards.length >= 4) {
      setStackLeft(true);
    }
    if (dealerCards.length >= 4 ) {
      setStackRight(true);
    }
  }, [playerCards, dealerCards])

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
            <div className='home-container home-width-2 home-height pos-absolute no-overflow'>
              <div className='tiers-stacks transition-from transition-to move-l bg-board play-outline-def' data-fade={'Betwixt'}>
                <div className='card-container-d'>
                </div>
                <div className='para-house width-5'>
                  <span className='flip'>C:</span>
                </div>
              </div>
              <div className='tiers-stacks transition-from transition-to move-r bg-board play-outline-def' data-fade={'Blackjack'}>
                <div className='para-patron width-5'>
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
            <div className='mix-blend-mode-diff home-height pos-absolute home-width-2 bg-z'>
            </div>
            <div className='home-container home-width-2 home-height pos-absolute no-overflow'>
              <div className='tiers-stacks transition-from move-l bg-board play-outline-def' data-fade={'Betwixt'}>
                <div className='card-container-d'>
                  {dealerCards.map((cards, i) => {
                    return <Card imgTag={moveState === ('init' || 'player') && i === 0 && cards.split('').includes(('d' || 'h')) ? 'card2b' : moveState === ('init' || 'player') && i === 0 ? 'card1b' : cards} index={i+10} key={'d'+String(i)} moveState={moveState}/>
                  })}
                </div>
                <div className='para-house width-100'>
                  <span className='flip'>C:</span>
                  <span className='score-1 score-text fade-in'>{score2}</span>
                </div>
              </div>
              <div className='tiers-stacks transition-from move-r bg-board play-outline-def' data-fade={'Blackjack'}>
                <div className='para-patron width-100'>
                  <span className='flip-2'>U:</span>
                  <span className='score-2 score-text fade-in'>{score1}</span>
                </div>
                <div className='card-container-p'>
                  {playerCards.map((cards, i) => {
                    return <Card imgTag={cards} index={i} key={'p'+String(i)} moveState={moveState}/>
                  })}
                </div>
              </div>
              <div className='tiers-stacks transition-from transition-to bg-board play-outline-def'>
                <div 
                  onClick={() => handleActionPush('init-hit')}
                  className='hit-container action-btn pop-out-l'
                >
                  <span className='hit-txt action-font'>hit</span>
                </div>
                <p className='line-1 line-2 gradient-text'>
                  {suitesString}
                </p>
                <div 
                  onClick={() => handleActionPush('init-stand')}
                  className='stand-container action-btn pop-out-r'
                >
                  <span className='stand-txt action-font'>stand</span>
                </div>
              </div>
            </div>
          </div>
        </>
      }
      {/* player has chosen initial move, play begins */}
      {gameState === gamePhases[5] &&
        <>
          <div className='page-center page-height'>
            <div className='mix-blend-mode-diff home-height pos-absolute home-width-2 bg-z'>
            </div>
            <div className='home-container home-width-2 home-height pos-absolute no-overflow'>
              {/*DEALER*/}
              <div className='tiers-stacks transition-from move-l bg-board play-outline-def' data-fade={'Betwixt'}>
                <div className={stackRight ? 'card-container-d stack-r width-10' : 'card-container-d width-5'}>
                  {dealerCards.map((cards, i) => {
                    return <Card imgTag={moveState === 'player' && i === 0 && cards.split('').includes(('d' || 'h')) ? 'card2b' : moveState === 'player' && i === 0 ? 'card1b' : cards} index={i+10} key={'d'+String(i)} moveState={moveState}/>
                  })}
                </div>
                <div className='para-house width-100'>
                  <span className='flip'>C:</span>
                  <span className={!scorePhase ? 'score-1 score-text fade-in' : 'score-1 score-text'}>{score2}</span>
                </div>
              </div>
              {/*PLAYER*/}
              <div className='tiers-stacks transition-from move-r bg-board play-outline-def' data-fade={'Blackjack'}>
                <div className='para-patron width-100'>
                  <span className='flip-2'>U:</span>
                  <span className={!scorePhase ? 'score-2 score-text fade-in' : 'score-2 score-text'}>{score1}</span>
                </div>
                <div className={stackLeft ? 'card-container-p stack-l width-10' : 'card-container-p width-5'}>
                  {playerCards.map((cards, i) => {
                    return <Card imgTag={cards} index={i} key={'p'+String(i)} moveState={moveState}/>
                  })}
                </div>
              </div>
              {/*CHIPS/ACTION BTNS*/}
              <div className='tiers-stacks transition-from transition-to bg-board play-outline-def'>
                <div 
                  onClick={() => handleActionPush('hit')}
                  className={actionCooldown ? 'hit-container action-btn out-l disappear-l' : 'hit-container action-btn out-l appear-l'}
                  disabled={actionCooldown}
                >
                  <span className='hit-txt action-font'>hit</span>
                </div>
                <p className='line-1 line-2 gradient-text'>
                  {suitesString}
                </p>
                <div 
                  onClick={() => handleActionPush('stand')}
                  className={actionCooldown ? 'stand-container action-btn out-r disappear-r' : 'stand-container action-btn out-r appear-r'}
                  disabled={actionCooldown}
                >
                  <span className='stand-txt action-font'>stand</span>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </>
  )
}

export default Game;