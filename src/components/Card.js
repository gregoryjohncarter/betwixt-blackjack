import React from 'react';
import source from '../assets/index';

const Card = ({ imgTag }) => {
  return (
    <img src={source[imgTag]} alt={imgTag}/>
  )
}

export default Card;