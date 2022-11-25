import React, { useState, useEffect } from 'react';

const Home = ({ startGame, showSuites }) => {
  // provide randomized suites string for JSX typewriter effect
  const [suitesState, setSuitesState] = useState('');
  useEffect(() => {
    // shuffle symbols w/ typewriter effect
    let suiteChars = '✳✫♥✧♧♠✧♣♤♡♦♢✳✫♥✧♧';
    suiteChars = suiteChars.split('');
    let suites = [];
    while (suiteChars.length) {
      let index = Math.floor(Math.random() * suiteChars.length);
      suites.push(suiteChars[index]);
      suiteChars.splice(index, 1);
    }
    setSuitesState(suites.join(''));
  }, []);

  // initialize start sequence
  useEffect(() => {
    if (showSuites) {
      const p = document.querySelector('p');
      // handle typewriter effect and page transition
      p.classList.remove('display-none');
      p.classList.add('anim-typewriter');
      const start = document.querySelector('.start');
      start.classList.add('begin-outline');
    }
  }, [showSuites]);

  return (
    <>
      <div className='home-container'>
        <div className='tiers-stacks'>
          <span className='offset-text'>
            Betwixt
          </span>
        </div>
        <div className='tiers-stacks'>
          <span className='offset-text'>
            Blackjack
          </span>
        </div>
        <div className='tiers-stacks color-shifter start'
          onClick={() => startGame(true)}
        >
          <p className="line-1 display-none gradient-text">
            {suitesState}
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