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
              }, 1150)
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
        let cards = [...deckState];
        cards = cards.slice(0, 1);
        let player = [...playerCards];
        player.push(cards[0]);
        setPlayerCards(player);
        let justDealt = cards;
        setDeckState(prevDeck => prevDeck.filter(filter => {return !justDealt.includes(filter)}));
        break;
      case 'dealer':
        let deck = [...deckState];
        deck = deck.slice(0, 1);
        setDealerCards((p) => [...p, deck[0]]);
        let newCard = deck;
        setDeckState(prevDeck => prevDeck.filter(filter => {return !newCard.includes(filter)}));
        break;
      default:
        let fourCards = [...deckState];
        fourCards = fourCards.slice(0, 4);
        setDealerCards([fourCards[0], fourCards[1]]);
        setPlayerCards([fourCards[2], fourCards[3]]);
        let dealt = fourCards;
        setDeckState(prevDeck => prevDeck.filter(filter => {return !dealt.includes(filter)}));
        break;
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
  const [is1Changing, setIs1Changing] = useState(false);
  const [is2Changing, setIs2Changing] = useState(false);

  // scorekeeper automatically updates
  useEffect(() => {
    if (playerCards.length && dealerCards.length) {
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
      const replaceJoker = (playerTurn) => {
        if (dealerCards.includes('card1j')) {
          var cards = null;
          if (playerTurn === 'init') {
            cards = [dealerCards[1]].filter((filter) => {return filter !== 'card1j'});
          } else {
            cards = dealerCards.filter((filter) => {return filter !== 'card1j'});
          }
          let deck = [...deckState];
          setDealerCards([...cards, deck[0]]);
          setDeckState(deck.filter((filter) => {return filter !== deck[0]}));
        } else if (playerCards.includes('card1j')) {
          let cards = playerCards.filter((filter) => {return filter !== 'card1j'});
          let deck = [...deckState];
          setPlayerCards([...cards, deck[0]]);
          setDeckState(deck.filter((filter) => {return filter !== deck[0]}));
        }
      };
      if (gameState === 'play') {
        if (moveState === 'player') {
          setIs2Changing(true);
        } else if (moveState === 'dealer') {
          setIs1Changing(true);
        }
        setTimeout(() => {
          countScore(moveState);
          setTimeout(() => {
            if (moveState === 'player') {
              setIs2Changing(false);
            } else if (moveState === 'dealer') {
              setIs1Changing(false);
            }
            replaceJoker(moveState);
          }, 500)
        }, 750);
      } else {
        if (playerCards.length > 1 && dealerCards.length > 1) {
          countScore(moveState);
          setTimeout(() => {
            replaceJoker(moveState);
          }, 500);
        }
      }
    }
  }, [playerCards, dealerCards, moveState]);

  const [determineBlackjack, setDetermineBlackjack] = useState({});
  // keep track of limit > blackjack
  useEffect(() => {
    if (score1 > 21) {
      setDetermineBlackjack((p) => ({...p, player1: 'bust'}));
      setMoveState('dealer');
    } else if (score1 === 21) {
      setDetermineBlackjack((p) => ({...p, player1: 'blackjack'}));
      setMoveState('dealer');
    } else {
      if (score1 !== 21) {
        setDetermineBlackjack((p) => ({...p, player1: score1}));
      }
    }
    if (moveState === 'dealer') {
      if (score2 > 21) {
        setDetermineBlackjack((p) => ({...p, player2: 'bust'}));
      } else if (score2 === 21) {
        setDetermineBlackjack((p) => ({...p, player2: 'blackjack'}));
      } else {
        if (score2 !== 21) {
          setDetermineBlackjack((p) => ({...p, player2: score2}));
        }
      }
    }
  }, [score1, score2])

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
          // pop up selections
          const hit = document.querySelector('.hit-container');
          hit.classList.add('out-l');
          const stand = document.querySelector('.stand-container');
          stand.classList.add('out-r');
        }, 4000)
      }, 100);
    }
  }, [gameState]);

  const [actionCooldown, setActionCooldown] = useState(false);
  // triggers when an action is pushed, and then reverts after timeout
  const handleCooldown = () => {
    setActionCooldown(true);
    setTimeout(() => {
      setActionCooldown(false);
    }, 1000);
  };

  const handleActionPush = (action) => {
    if (actionCooldown) {
      return;
    }
    if (action === 'init-hit') {
      setGameState(gamePhases[5]);
      setMoveState('player');
    } else if (action === 'init-stand') {
      setGameState(gamePhases[5]);
      setMoveState('dealer');
    } else if (action === 'hit') {
      dealCards('player');
      handleCooldown();
    } else if (action === 'stand') {
      setMoveState('dealer');
      handleCooldown();
    } else {
      return;
    }
  }

  useEffect(() => { // on gameState[5] 
    if (gameState === gamePhases[5]) {
      handleCooldown();
      if (moveState === 'player') {
        dealCards('player');
      }
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
  }, [playerCards, dealerCards]);

  // custom hook being tried out to remedy async state sequence issue
  // referenced 'https://dev.to/bytebodger/synchronous-state-with-react-hooks-1k4f'
  const useTrait = (initialValue) => {
    // trait = 'dealer choice' trigger
    const [trait, updateTrait] = useState(initialValue);
 
    let current = trait;
 
    const get = () => current;
 
    const set = newValue => {
      current = newValue;
      updateTrait(newValue);
      return current;
    }
 
    return {
      get,
      set,
    }
 }

 const dealerChoice = useTrait(false);
 const [endPhase, setEndPhase] = useState(false);

 // dealer will draw up to two times after player stands
 const handleDealerTurn = () => {
  const handleEnd = () => {
    setTimeout(() => {
      setEndPhase(true);
    }, 1500);
  }
  const decision = Math.random() * 1;
  if (decision >= .4) {
    dealCards('dealer');
  }
  if (!dealerChoice.get()) {
    const choice = Math.random() * 1;
    if (choice >= .3) {
      dealerChoice.set(true);
    } else {
      // handle ending conditionals
      handleEnd();
    }
  } else {
    // ^
    handleEnd();
  }
};

  useEffect(() => {
    if (moveState === 'dealer') {
      setTimeout(() => {
        handleDealerTurn();
      }, 1500);
    }
  }, [moveState]);

  useEffect(() => {
    if (dealerChoice.get() && score2 <= 21) {
      setTimeout(() => {
        handleDealerTurn();
      }, 1500);
    }
  }, [dealerChoice.get()]);

  // use to determine end results
  useEffect(() => {
    if (endPhase) {
      const resetGame = () => {
        setEndPhase(false);
        setActionCooldown(false);
        setStackLeft(false);
        setStackRight(false);
        dealCards('init');
        setMoveState('init');
        setGameState(gamePhases[4]);
      }
      setTimeout(() => {
        const determineWinner = () => {
          if (determineBlackjack.player1 === 'blackjack') {
            if (determineBlackjack.player2 !== 'blackjack') {
              alert('Player 1 wins!');
              return;
            }
          } else if (determineBlackjack.player1 === 'bust') {
            if (determineBlackjack.player2 !== 'bust') {
              alert('Player 2 wins!');
              return;
            } else if (determineBlackjack.player2 === 'bust') {
              alert('Draw!');
              return;
            }
          }
          if (determineBlackjack.player2 === 'blackjack') {
            if (determineBlackjack.player1 !== 'blackjack') {
              alert('Player 2 wins!');
              return;
            }
          } else if (determineBlackjack.player2 === 'bust') {
            if (determineBlackjack.player1 !== 'bust') {
              alert('Player 1 wins!');
              return;
            } else if (determineBlackjack.player1 === 'bust') {
              alert('Draw!');
              return;
            }
          }
          if (determineBlackjack.player1 > determineBlackjack.player2) {
            alert('Player 1 wins!');
            return;
          } else if (determineBlackjack.player2 > determineBlackjack.player1) {
            alert('Player 2 wins!');
            return;
          } else {
            alert('Draw!');
            return;
          }
        }
        determineWinner();
        setTimeout(() => {
          resetGame();
        }, 2000)
      }, 4000);
    }
  }, [endPhase]);

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
                  {/* replace 'd' in 'card' string to allow subsequent 'd' char conditional (for flipped card color) */}
                  {dealerCards.map((cards, i) => {
                    cards = cards.split('');
                    for (let i = 0; i < cards.length; i++) {
                      if (cards[i] === 'd') {
                        cards[i] = 'x';
                      break;
                      }
                    }
                    return <Card imgTag={moveState === ('init' || 'player') && i === 0 && cards.includes(('d' || 'h')) ? 'card2b' : moveState === ('init' || 'player') && i === 0 ? 'card1b' : cards.join('').replace('x','d')} index={i+10} key={'d'+String(i+10)} moveState={moveState}/>
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
                  className={actionCooldown || (moveState === 'dealer') ? 'hit-container action-btn out-l disappear-l mobile-hover' : 'hit-container action-btn pop-out-l'}
                  disabled={actionCooldown || (moveState === 'dealer')}
                >
                  <span className='hit-txt action-font'>hit</span>
                  
                </div>
                <p className='line-1 line-2 gradient-text'>
                  {suitesString}
                </p>
                <div 
                  onClick={() => handleActionPush('init-stand')}
                  className={actionCooldown || (moveState === 'dealer') ? 'stand-container action-btn out-r disappear-r mobile-hover' : 'stand-container action-btn pop-out-r'}
                  disabled={actionCooldown || (moveState === 'dealer')}
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
                <div className={stackRight ? 'card-container-d stack-r width-10': dealerCards.length > 2 ? 'card-container-d width-5' : 'card-container-d width'}>
                  {dealerCards.map((cards, i) => {
                    cards = cards.split('');
                    for (let i = 0; i < cards.length; i++) {
                      if (cards[i] === 'd') {
                        cards[i] = 'x'
                      break;
                      }
                    }
                    return <Card imgTag={moveState === 'player' && i === 0 && cards.includes(('d' || 'h')) ? 'card2b' : moveState === 'player' && i === 0 ? 'card1b' : cards.join('').replace('x','d')} index={i+10} key={'d'+String(i+10)} moveState={moveState} current={dealerCards.length}/>
                  })}
                </div>
                <div className='para-house width-100'>
                  <span className='flip'>C:</span>
                  <span className={is1Changing ? 'score-1 score-text is-changing' : 'score-1 score-text'}>{score2}</span>
                </div>
              </div>
              {/*PLAYER*/}
              <div className='tiers-stacks transition-from move-r bg-board play-outline-def' data-fade={'Blackjack'}>
                <div className='para-patron width-100'>
                  <span className='flip-2'>U:</span>
                  <span className={is2Changing ? 'score-2 score-text is-changing-2' : 'score-2 score-text'}>{score1}</span>
                </div>
                <div className={stackLeft ? 'card-container-p stack-l width-10' : playerCards.length > 2 ? 'card-container-p width-5' : 'card-container-p width'}>
                  {playerCards.map((cards, i) => {
                    return <Card imgTag={cards} index={i} key={'p'+String(i)} moveState={moveState} current={playerCards.length}/>
                  })}
                </div>
              </div>
              {/*CHIPS/ACTION BTNS*/}
              <div className='tiers-stacks transition-from transition-to bg-board play-outline-def'>
                <div 
                  onClick={() => handleActionPush('hit')}
                  className={actionCooldown || (moveState === 'dealer') ? 'hit-container action-btn out-l disappear-l mobile-hover' : 'hit-container action-btn out-l appear-l'}
                  disabled={actionCooldown || (moveState === 'dealer')}
                >
                  <span className='hit-txt action-font'>hit</span>
                </div>
                <p className='line-1 line-2 gradient-text'>
                  {suitesString}
                </p>
                <div 
                  onClick={() => handleActionPush('stand')}
                  className={actionCooldown || (moveState === 'dealer') ? 'stand-container action-btn out-r disappear-r mobile-hover' : 'stand-container action-btn out-r appear-r'}
                  disabled={actionCooldown || (moveState === 'dealer')}
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