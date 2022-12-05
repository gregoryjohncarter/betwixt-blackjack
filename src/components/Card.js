import React, { useEffect, useState } from 'react';
import source from '../assets/index';

const Card = ({ imgTag, index, moveState }) => {
  const [displayCard, setDisplayCard] = useState(false);

  useEffect(() => {
    // used to render cards one by one at intervals on initial deal
    if (moveState === 'init') {
      if (index >= 10) {
        const delay = ((index - 10) * 500) + 250;
        setTimeout(() => {
          setDisplayCard(true);
        }, delay) 
      } else {
        const delay = index * 500;
        setTimeout(() => {
          setDisplayCard(true);
        }, delay)
      } 
    } else {
      setDisplayCard(true);
    }
  }, [moveState, index])

  return (
    <>
      {displayCard && <img className='' src={source[imgTag]} alt={imgTag}/>}
    </>
  )
}

export default Card;