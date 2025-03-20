import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';

interface TextSelectionContextType {
  selectedText: string;
  setSelectedText: (text: string) => void;
}

const TextSelectionContext = createContext<TextSelectionContextType>({
  selectedText: '',
  setSelectedText: () => {},
});

interface TextSelectionProviderProps {
  children: ReactNode;
}

export const TextSelectionProvider: React.FC<TextSelectionProviderProps> = ({ children }) => {
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection && selection.toString().trim()) {
        setSelectedText(selection.toString());
      }
    };

    // Add event listener for mouseup to detect text selection
    document.addEventListener('mouseup', handleSelectionChange);

    // Clean up event listener
    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
    };
  }, []);

  return (
    <TextSelectionContext.Provider value={{ selectedText, setSelectedText }}>
      {children}
    </TextSelectionContext.Provider>
  );
};

// Custom hook to use the selection context
export const useTextSelection = () => useContext(TextSelectionContext);