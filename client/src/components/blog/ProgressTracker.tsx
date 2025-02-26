import { useState, useEffect } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

interface ProgressTrackerProps {
  postId: number;
  userId?: number; // Optional as we might not have a logged-in user
}

const ProgressTracker = ({ postId, userId = 1 }: ProgressTrackerProps) => {
  const [progress, setProgress] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Fetch initial progress
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        if (!userId) return;
        
        const res = await fetch(`/api/reading-progress/${userId}/${postId}`);
        if (res.ok) {
          const data = await res.json();
          setProgress(data.progress || 0);
        }
      } catch (error) {
        console.error("Error fetching reading progress:", error);
      }
    };

    fetchProgress();
  }, [postId, userId]);

  // Track scroll position to determine reading progress
  useEffect(() => {
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
        updateReadingProgress(scrollPercentage);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [postId, userId, progress]);

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
        toast({
          title: "Error",
          description: "Failed to update reading progress",
          variant: "destructive",
        });
      } finally {
        setIsUpdating(false);
      }
    }, 1000); // Debounce for 1 second
  };

  return (
    <div className="fixed top-16 left-0 right-0 h-1 z-50 bg-gray-100">
      <Progress value={progress} className="h-full rounded-none" />
    </div>
  );
};

export default ProgressTracker;
