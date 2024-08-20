import { useTheme } from 'next-themes';
import React from 'react';

function JemlaNoText({ width = '1080', height = '1080' }) {
  const { theme } = useTheme();

  return (
    <img 
      src='/images/JEMLA no text horizontal.png' 
      alt='Jemla' 
      width={width} 
      height={height} 
      style={{ 
        objectFit: 'cover', 
        filter: theme === 'dark' ? 'invert(1)' : 'none'
      }}
    />
  );
}

export default JemlaNoText;
