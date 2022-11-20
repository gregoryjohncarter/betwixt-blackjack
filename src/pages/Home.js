import React from 'react';

const Home = ({ startGame }) => {

  return (
    <>
      <p>Home</p>
      <button
        onClick={() => startGame(true)}
      >
        Start
      </button>
    </>
  )
}

export default Home;