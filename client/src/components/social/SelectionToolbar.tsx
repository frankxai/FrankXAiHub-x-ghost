import React, { useState, useEffect, useRef } from 'react';
import { useTextSelection } from './TextSelectionShareProvider';
import TwitterShareButton from './TwitterShareButton';
import LinkedInShareButton from './LinkedInShareButton';
import { Button } from '@/components/ui/button';
import { Copy, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SelectionToolbarProps {
  postTitle: string;
  postUrl: string;
}

const SelectionToolbar: React.FC<SelectionToolbarProps> = ({ postTitle, postUrl }) => {
  const { selectedText } = useTextSelection();
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const toolbarRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedText && selectedText.length > 10) { // Only show for meaningful selections
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        // Position the toolbar above the selection, with better positioning
        const toolbarHeight = toolbarRef.current?.offsetHeight || 60;
        const toolbarWidth = toolbarRef.current?.offsetWidth || 200;
        
        setPosition({
          top: Math.max(10, rect.top - toolbarHeight - 10 + window.scrollY),
          left: Math.max(10, Math.min(
            window.innerWidth - toolbarWidth - 10,
            rect.left + rect.width / 2 - toolbarWidth / 2 + window.scrollX
          ))
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

  const copySelectedText = async () => {
    try {
      await navigator.clipboard.writeText(selectedText);
      toast({
        title: "Text copied!",
        description: "Selected text has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Unable to copy text to clipboard.",
        variant: "destructive",
      });
    }
  };

  const shareGeneric = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: postTitle,
          text: selectedText,
          url: postUrl,
        });
      } catch (error) {
        // User cancelled share
      }
    } else {
      // Fallback: copy to clipboard
      copySelectedText();
    }
  };

  if (!visible) return null;

  return (
    <div 
      ref={toolbarRef}
      className="fixed z-50 bg-white dark:bg-gray-800 shadow-xl rounded-lg p-3 flex items-center gap-2 border border-gray-200 dark:border-gray-700"
      style={{ 
        top: `${position.top}px`, 
        left: `${position.left}px`,
      }}
    >
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={copySelectedText}
          className="h-8 px-2"
        >
          <Copy className="h-4 w-4" />
        </Button>
        
        <div className="w-px h-6 bg-gray-300 dark:bg-gray-600" />
        
        <TwitterShareButton 
          selectedText={selectedText} 
          postTitle={postTitle} 
          postUrl={postUrl} 
        />
        
        <LinkedInShareButton 
          selectedText={selectedText} 
          postTitle={postTitle} 
          postUrl={postUrl} 
        />
        
        {'share' in navigator && (
          <Button
            variant="ghost"
            size="sm"
            onClick={shareGeneric}
            className="h-8 px-2"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default SelectionToolbar;