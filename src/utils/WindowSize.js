import { useState, useEffect } from 'react';


export const useWindowSize = () => {

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); 

  return windowSize;
}

export function getSize() {
    return {
      width: document.body.clientWidth,
      height: document.body.clientHeight
    };
  }