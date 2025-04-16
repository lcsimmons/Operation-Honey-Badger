import { createContext, useState, useContext, useEffect } from 'react';

export const TextSizeContext = createContext();

export const TextSizeProvider = ({ children }) => {
  const [textSize, setTextSize] = useState('text-base');

  useEffect(() => {
    const storedSize = localStorage.getItem('textSize');
    if (storedSize) setTextSize(storedSize);
  }, []);

  const updateTextSize = (newSize) => {
    setTextSize(newSize);
    localStorage.setItem('textSize', newSize);
  };

  return (
    <TextSizeContext.Provider value={{ textSize, updateTextSize }}>
      {children}
    </TextSizeContext.Provider>
  );
};

export const useTextSize = () => useContext(TextSizeContext);