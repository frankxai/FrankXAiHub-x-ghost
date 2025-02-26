import { useState } from "react";
import type { MusicSample } from "@shared/schema";
import { motion } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, ChevronRight } from "lucide-react";

interface MusicPlayerProps {
  samples: MusicSample[];
}

const MusicPlayer = ({ samples }: MusicPlayerProps) => {
  const [activeSample, setActiveSample] = useState<number | null>(null);
  const [progress, setProgress] = useState<Record<number, number>>({});
  
  const togglePlay = (id: number) => {
    if (activeSample === id) {
      setActiveSample(null);
      // Stop playback
    } else {
      if (activeSample !== null) {
        // Stop current playback
      }
      setActiveSample(id);
      // Start new playback
      
      // Simulate progress for the active sample
      if (!progress[id]) {
        simulatePlayback(id);
      }
    }
  };
  
  const simulatePlayback = (id: number) => {
    // Reset progress
    setProgress(prev => ({ ...prev, [id]: 0 }));
    
    // Simulate progress updates
    const duration = 1000; // 1 second per percent
    const interval = setInterval(() => {
      setProgress(prev => {
        const currentProgress = prev[id] || 0;
        
        if (currentProgress >= 100) {
          clearInterval(interval);
          setActiveSample(null);
          return prev;
        }
        
        return { ...prev, [id]: currentProgress + 1 };
      });
    }, duration / 100);
    
    // Clean up interval if component unmounts
    return () => clearInterval(interval);
  };

  return (
    <Card className="bg-gray-800 rounded-2xl shadow-lg">
      <CardHeader>
        <h4 className="font-clash font-bold text-xl mb-6 text-white">Featured AI Music Samples</h4>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {samples.map((sample) => (
          <motion.div 
            key={sample.id}
            className="bg-gray-700 bg-opacity-50 rounded-xl p-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h5 className="font-medium text-white">{sample.title}</h5>
                <p className="text-xs text-gray-400">{sample.tags}</p>
              </div>
              <Button
                size="icon" 
                className={`w-10 h-10 rounded-full ${activeSample === sample.id ? 'bg-white' : 'bg-secondary'}`}
                onClick={() => togglePlay(sample.id)}
              >
                {activeSample === sample.id ? (
                  <Pause className={`h-5 w-5 ${activeSample === sample.id ? 'text-secondary' : 'text-white'}`} />
                ) : (
                  <Play className="h-5 w-5 text-white" />
                )}
              </Button>
            </div>
            <div className="h-2 bg-gray-600 rounded-full overflow-hidden">
              <div 
                className="h-full bg-secondary transition-all duration-300 ease-in-out" 
                style={{ width: `${progress[sample.id] || 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-400">
              <span>
                {formatTime(progress[sample.id] || 0, sample.duration)}
              </span>
              <span>{sample.duration}</span>
            </div>
          </motion.div>
        ))}
      </CardContent>
      
      <CardFooter className="mt-6 text-center">
        <Button 
          variant="link" 
          className="mx-auto text-secondary hover:text-secondary/90 transition-colors"
        >
          Browse All Samples <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

// Helper function to format time
const formatTime = (progressPercent: number, totalDuration: string) => {
  const [minutes, seconds] = totalDuration.split(':').map(Number);
  const totalSeconds = minutes * 60 + seconds;
  const currentSeconds = Math.floor((totalSeconds * progressPercent) / 100);
  
  const currentMinutes = Math.floor(currentSeconds / 60);
  const remainingSeconds = currentSeconds % 60;
  
  return `${currentMinutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default MusicPlayer;
