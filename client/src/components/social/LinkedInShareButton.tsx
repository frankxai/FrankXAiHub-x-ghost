import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Share, Check } from 'lucide-react';
import { SiLinkedin } from 'react-icons/si';

interface LinkedInShareButtonProps {
  selectedText: string;
  postTitle: string;
  postUrl: string;
}

const LinkedInShareButton: React.FC<LinkedInShareButtonProps> = ({
  selectedText,
  postTitle,
  postUrl
}) => {
  const { toast } = useToast();
  const [shareText, setShareText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Prepare LinkedIn post content
  React.useEffect(() => {
    if (selectedText) {
      const quote = selectedText.trim();
      const postContent = `"${quote}"\n\nInsights from "${postTitle}"`;
      
      // LinkedIn allows up to 3000 characters, but keep it concise
      const maxLength = 1000;
      const truncatedContent = postContent.length > maxLength
        ? postContent.substring(0, maxLength - 3) + '...'
        : postContent;
      
      const fullPost = `${truncatedContent}\n\nRead more: ${postUrl}\n\n#AI #Innovation #Leadership #Technology`;
      setShareText(fullPost);
    } else {
      const defaultText = `Valuable insights from "${postTitle}"\n\nRead more: ${postUrl}\n\n#AI #Innovation #Leadership #Technology`;
      setShareText(defaultText);
    }
  }, [selectedText, postTitle, postUrl]);

  const shareOnLinkedIn = () => {
    // LinkedIn sharing URL
    const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`;
    window.open(linkedInUrl, '_blank', 'width=550,height=500');
    setIsOpen(false);
    
    toast({
      title: "LinkedIn Share Ready!",
      description: "LinkedIn share window opened. Add your commentary and share the insights.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareText);
    toast({
      title: "Copied to clipboard!",
      description: "LinkedIn post content has been copied. You can now paste it anywhere.",
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
          <SiLinkedin className="h-4 w-4 text-blue-600" />
          <span>LinkedIn</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="space-y-4">
          <h3 className="font-medium text-sm">Share on LinkedIn</h3>
          <Textarea
            value={shareText}
            onChange={(e) => setShareText(e.target.value)}
            className="min-h-[120px] text-sm"
            placeholder="Write your LinkedIn post..."
          />
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>{shareText.length}/3000 characters</span>
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
                onClick={shareOnLinkedIn}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <SiLinkedin className="h-4 w-4 mr-1" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LinkedInShareButton;