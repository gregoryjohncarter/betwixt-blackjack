import React from 'react';
import source from '../assets/index';

const Card = ({ imgTag, index }) => {
  const imgStyle = {
    '--i': `${index+1}`
  };
  return (
    <img style={imgStyle} className='' src={source[imgTag]} alt={imgTag}/>
  )
}

export default Card;