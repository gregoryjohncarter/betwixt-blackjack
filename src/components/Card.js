import React, { useEffect, useState } from 'react';
import source from '../assets/index';

const Card = ({ imgTag, index, moveState, overlapLeft, overlapRight }) => {
  const [displayCard, setDisplayCard] = useState(false);

  useEffect(() => {
    // used to render cards one by one at intervals on initial deal
    if (moveState === 'init') {
      if (index >= 10) {
        var delay = ((index - 10) * 500) + 250;
        setTimeout(() => {
          setDisplayCard(true);
        }, delay) 
      } else {
        var delay = index * 500;
        setTimeout(() => {
          setDisplayCard(true);
        }, delay)
      } 
    } else {
      setDisplayCard(true);
    }
  }, [])

  return (
    <>
      {displayCard && <img className='' src={source[imgTag]} alt={imgTag}/>}
    </>
  )
}

export default Card;