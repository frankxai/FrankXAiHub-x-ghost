import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Share, Check, Twitter } from 'lucide-react';

interface TwitterShareButtonProps {
  selectedText: string;
  postTitle: string;
  postUrl: string;
}

const MAX_TWITTER_LENGTH = 280;

const TwitterShareButton: React.FC<TwitterShareButtonProps> = ({
  selectedText,
  postTitle,
  postUrl
}) => {
  const { toast } = useToast();
  const [tweetText, setTweetText] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  // Prepare default tweet text when selection changes
  useEffect(() => {
    if (selectedText) {
      // Create tweet text with the selected quote, title, and URL
      const quote = selectedText.trim();
      // Estimate the URL length (Twitter uses t.co shortener which is ~23 chars)
      const urlLength = 23;
      const attribution = ` - from "${postTitle}"`;
      
      // Calculate available space
      const availableSpace = MAX_TWITTER_LENGTH - urlLength - attribution.length - 5; // 5 chars for spaces and quotes
      
      // Truncate quote if needed
      const truncatedQuote = quote.length > availableSpace 
        ? quote.substring(0, availableSpace - 3) + '...' 
        : quote;
      
      const newTweetText = `"${truncatedQuote}"${attribution} ${postUrl}`;
      setTweetText(newTweetText);
      setCharCount(newTweetText.length);
    } else {
      // Default message if no text is selected
      const defaultText = `Check out "${postTitle}" ${postUrl}`;
      setTweetText(defaultText);
      setCharCount(defaultText.length);
    }
  }, [selectedText, postTitle, postUrl]);

  const handleTweetTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweetText(e.target.value);
    setCharCount(e.target.value.length);
  };

  const shareOnTwitter = () => {
    // Twitter Web Intent URL
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    setIsOpen(false);
    
    toast({
      title: "Ready to Tweet!",
      description: "Twitter share window opened. Post your tweet to share this content.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tweetText);
    toast({
      title: "Copied to clipboard!",
      description: "Tweet text has been copied. You can now paste it anywhere.",
    });
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1"
          disabled={!selectedText}
        >
          <Twitter className="h-4 w-4" />
          <span>Tweet this</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Share on Twitter</h3>
          <Textarea
            value={tweetText}
            onChange={handleTweetTextChange}
            className="min-h-[100px]"
            maxLength={MAX_TWITTER_LENGTH}
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span className={charCount > MAX_TWITTER_LENGTH ? "text-red-500" : ""}>
              {charCount}/{MAX_TWITTER_LENGTH}
            </span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={copyToClipboard}
              >
                <Check className="h-4 w-4 mr-1" />
                Copy
              </Button>
              <Button 
                size="sm"
                onClick={shareOnTwitter}
                disabled={charCount > MAX_TWITTER_LENGTH}
              >
                <Twitter className="h-4 w-4 mr-1" />
                Tweet
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default TwitterShareButton;