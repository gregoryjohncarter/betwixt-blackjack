import React from 'react';
import source from '../assets/index';

import Card from '../components/Card';

const Game = () => {
  let deckProperties = source;
  delete deckProperties.card1b;
  delete deckProperties.card2b;

  const deck = [];

  Object.keys(deckProperties).forEach((key) => {
    deck.push(key);
  })

  console.log(deck);
  const shuffledDeck = [];

  const shuffleDeck = (array) => {
    while (array.length) {
      let index = Math.floor(Math.random() * array.length);
      shuffledDeck.push(array[index]);
      array.splice(index, 1);
    }
  }

  shuffleDeck(deck)
  console.log(shuffledDeck);

  return (
    <>
      <p>Game</p>
      <Card imgTag={shuffledDeck[10]}/>
    </>
  )
}

export default Game;