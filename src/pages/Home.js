import React, { useEffect } from 'react';

const Home = ({ startGame, showSuites, suitesString, setSuitesString }) => {
  // on initialize start sequence
  useEffect(() => {
    if (showSuites) {
      // outline snap
      const start = document.querySelector('.start');
      start.classList.add('begin-outline');
      setTimeout(() => {
        // fade arrow
        const btn = document.querySelector('.left-right');
        btn.classList.add('fade-out');
        // typewriter effect
        const p = document.querySelector('p');
        p.classList.remove('display-none');
        p.classList.add('anim-typewriter');
        // cursor change
        start.classList.add('loading');
        const btnStart = document.querySelector('.btn-start');
        btnStart.classList.add('loading');
        setTimeout(() => {
          // slight aligning of text
          const betwixt = document.querySelector('span[data-fade="Betwixt"]');
          const blackjack = document.querySelector('span[data-fade="Blackjack"]');
          betwixt.classList.add('offset');
          blackjack.classList.add('offset');
          // new outline
          start.classList.remove('start');
          start.classList.remove('begin-outline');
          start.classList.add('transition-from');
          start.classList.add('transition-to');
          setTimeout(() => {
            // end the color shifting anim
            const color = document.querySelector('.color-shifter');
            color.classList.add('color-shifter-end');
            color.classList.remove('color-shifter');
            // handle text fades
            setTimeout(() => {
              betwixt.classList.add('fade-out');
              setTimeout(() => {
                blackjack.classList.add('fade-out');
                setTimeout(() => {
                  // suites div outline fx
                  start.classList.remove('transition-to');
                  setTimeout(() => {
                    // shift the columns
                    const center = document.querySelector('.page-center');
                    center.classList.add('page-height');
                  }, 1000)
                }, 1000)
              }, 1000)
            }, 1000)
          }, 1000)
        }, 5000)
      }, 1000);
    }
  }, [showSuites]);

  useEffect(() => {
    let suiteChars = '♡♠♤♦♢♣♥♧';
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
      <div className='page-center'>
        <div className='home-container mix-blend-mode-diff'>
          <div className='tiers-stacks hue-rotate'>
            <span data-fade={'Betwixt'} className='offset-text'>
              Betwixt
            </span>
          </div>
          <div className='tiers-stacks hue-rotate'>
            <span data-fade={'Blackjack'} className='offset-text'>
              Blackjack
            </span>
          </div>
          <div className='tiers-stacks color-shifter start'
            onClick={() => startGame(true)}
          >
            <p className='line-1 display-none gradient-text'>
              {suitesString}
            </p>
            <div className='left-right'>
              <span className='btn-start offset-text'>
                →
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Home;