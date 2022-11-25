import React, { useEffect } from 'react';

const Home = ({ startGame, showSuites, suitesString, setSuitesString }) => {
  // on initialize start sequence
  useEffect(() => {
    if (showSuites) {
      const p = document.querySelector('p');
      // handle typewriter effect
      p.classList.remove('display-none');
      p.classList.add('anim-typewriter');
      const start = document.querySelector('.start');
      start.classList.add('loading');
      const btnStart = document.querySelector('.btn-start');
      btnStart.classList.add('loading');
      // handle outline snap
      start.classList.add('begin-outline');
      setTimeout(() => {
        start.classList.remove('start');
        start.classList.remove('begin-outline');
        // handle outline fill
        start.classList.add('transition-from');
        start.classList.add('fill-in');
        // handle incremental fade outs
        setTimeout(() => {
          // end the color shifting anim
          const color = document.querySelector('.color-shifter');
          color.classList.add('color-shifter-end');
          color.classList.remove('color-shifter');
          const btn = document.querySelector('.left-right');
          btn.classList.add('fade-out');
          setTimeout(() => {
            const betwixt = document.querySelector('span[data-fade="Betwixt"]');
            betwixt.classList.add('fade-out');
            setTimeout(() => {
              const blackjack = document.querySelector('span[data-fade="Blackjack"]');
              blackjack.classList.add('fade-out');
            }, 750)
          }, 750)
        }, 1000)
      }, 4000);
    }
  }, [showSuites]);

  useEffect(() => {
    let suiteChars = '✳✫♥✧♧♠✧♣♤♡♦♢✳✫♥✧♧';
    suiteChars = suiteChars.split('');
    let suites = [];
    while (suiteChars.length) {
      let index = Math.floor(Math.random() * suiteChars.length);
      suites.push(suiteChars[index]);
      suiteChars.splice(index, 1);
    }
    setSuitesString(suites.join(''));
  }, []);

  return (
    <>
      <div className='home-container'>
        <div className='tiers-stacks'>
          <span data-fade={'Betwixt'} className='offset-text'>
            Betwixt
          </span>
        </div>
        <div className='tiers-stacks'>
          <span data-fade={'Blackjack'} className='offset-text'>
            Blackjack
          </span>
        </div>
        <div className='tiers-stacks color-shifter start'
          onClick={() => startGame(true)}
        >
          <p className="line-1 display-none gradient-text">
            {suitesString}
          </p>
          <div className='left-right'>
            <span className='btn-start offset-text'>
              →
            </span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;