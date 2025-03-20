import React, { useState, useEffect, useRef } from 'react';
import { useTextSelection } from './TextSelectionShareProvider';
import TwitterShareButton from './TwitterShareButton';

interface SelectionToolbarProps {
  postTitle: string;
  postUrl: string;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({ postTitle, postUrl }) => {
  const { selectedText } = useTextSelection();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedText) {
      // Get position of the selection
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Position the toolbar above the selection
        setPosition({
          top: rect.top - (toolbarRef.current?.offsetHeight || 0) - 10 + window.scrollY,
          left: rect.left + rect.width / 2 + window.scrollX
        });
        setVisible(true);
      }
    } else {
      setVisible(false);
    }
  }, [selectedText]);

  // Hide toolbar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (!visible) return null;

  return (
    <div 
      ref={toolbarRef}
      className="fixed z-50 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 flex items-center gap-2 border border-gray-200 dark:border-gray-700 transform -translate-x-1/2"
      style={{ 
        top: `${Math.max(10, position.top)}px`, 
        left: `${position.left}px`,
      }}
    >
      <TwitterShareButton 
        selectedText={selectedText} 
        postTitle={postTitle} 
        postUrl={postUrl} 
      />
    </div>
  );
};

export default SelectionToolbar;