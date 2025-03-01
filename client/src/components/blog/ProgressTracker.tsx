import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  postId: number;
  userId?: number; // Optional as we might not have a logged-in user
  progress?: number; // Allow parent to control progress directly
}

const ProgressTracker = ({ postId, userId = 1, progress: externalProgress }: ProgressTrackerProps) => {
  const [progress, setProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  // If external progress is provided, use it, otherwise calculate from scroll
  useEffect(() => {
    if (externalProgress !== undefined) {
      setProgress(externalProgress);
      
      // Save progress to localStorage for reading history
      if (externalProgress > 0) {
        localStorage.setItem(`reading-progress-${postId}`, externalProgress.toString());
      }
      
      // Only update server when progress changes significantly (avoid too many requests)
      if (externalProgress % 10 === 0 || externalProgress === 100) {
        updateReadingProgress(externalProgress);
      }
    }
  }, [externalProgress, postId]);

  // Fetch initial progress if external progress is not provided
  useEffect(() => {
    // If external progress is provided, don't fetch from server
    if (externalProgress !== undefined) return;
    
    const fetchProgress = async () => {
      try {
        if (!userId) return;
        
        // First try to get from localStorage for immediate feedback
        const storedProgress = localStorage.getItem(`reading-progress-${postId}`);
        if (storedProgress) {
          setProgress(parseInt(storedProgress));
        }
        
        // Then fetch from server to ensure data consistency
        const res = await fetch(`/api/reading-progress/${userId}/${postId}`);
        if (res.ok) {
          const data = await res.json();
          const serverProgress = data.progress || 0;
          
          // Use the maximum progress between local storage and server
          if (serverProgress > parseInt(storedProgress || '0')) {
            setProgress(serverProgress);
            localStorage.setItem(`reading-progress-${postId}`, serverProgress.toString());
          }
        }
      } catch (error) {
        console.error("Error fetching reading progress:", error);
      }
    };

    fetchProgress();
  }, [postId, userId, externalProgress]);

  // Only track scroll position if external progress is not provided
  useEffect(() => {
    if (externalProgress !== undefined) return;
    
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Calculate how far the user has scrolled (as a percentage)
      const scrollPercentage = Math.min(
        Math.round((scrollTop / (documentHeight - windowHeight)) * 100),
        100
      );
      
      if (scrollPercentage > progress) {
        setProgress(scrollPercentage);
        localStorage.setItem(`reading-progress-${postId}`, scrollPercentage.toString());
        
        // Only update server when progress changes significantly (avoid too many requests)
        if (scrollPercentage % 10 === 0 || scrollPercentage === 100) {
          updateReadingProgress(scrollPercentage);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [postId, userId, progress, externalProgress]);

  // Debounced function to update progress in the backend
  const updateReadingProgress = async (newProgress: number) => {
    if (isUpdating || !userId) return;
    
    setIsUpdating(true);
    setTimeout(async () => {
      try {
        await apiRequest("POST", "/api/reading-progress", {
          userId,
          postId,
          progress: newProgress,
        });
      } catch (error) {
        // Silent fail - don't bother user with reading progress errors
        console.error("Error updating reading progress:", error);
      } finally {
        setIsUpdating(false);
      }
    }, 1000); // Debounce for 1 second
  };

  return (
    <div className="fixed top-16 left-0 right-0 h-1 z-50 bg-transparent">
      <Progress 
        value={progress} 
        className="h-full rounded-none bg-gray-200/30 dark:bg-gray-800/30" 
        indicatorClassName="bg-gradient-to-r from-primary to-secondary transition-all duration-300"
      />
    </div>
  );
};

export default ProgressTracker;
