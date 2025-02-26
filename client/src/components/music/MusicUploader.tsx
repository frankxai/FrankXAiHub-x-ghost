import { useState } from "react";
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animations";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MusicSample, InsertMusicSample } from "@shared/schema";
import { Music, Upload, X } from "lucide-react";

interface MusicUploaderProps {
  onSuccess?: (sample: MusicSample) => void;
}

const MusicUploader = ({ onSuccess }: MusicUploaderProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [duration, setDuration] = useState("3:00");
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Simple file size validation (under 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive",
        });
        return;
      }
      
      // Basic file type validation
      if (!file.type.startsWith("audio/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file (MP3, WAV, etc.)",
          variant: "destructive",
        });
        return;
      }
      
      setFileName(file.name);
      
      // In a real implementation, we would upload to a storage service
      // For now, create a temporary URL
      const tempUrl = URL.createObjectURL(file);
      setFileUrl(tempUrl);
      
      // Attempt to get duration
      const audio = new Audio(tempUrl);
      audio.addEventListener('loadedmetadata', () => {
        const minutes = Math.floor(audio.duration / 60);
        const seconds = Math.floor(audio.duration % 60);
        setDuration(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      });
    }
  };
  
  const handleRemoveFile = () => {
    setFileName(null);
    setFileUrl(null);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !fileUrl) {
      toast({
        title: "Missing information",
        description: "Please provide a title and upload an audio file",
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Prepare sample data
      const sampleData: InsertMusicSample = {
        title,
        description,
        tags,
        duration,
        audioUrl: fileUrl, // In production, this would be a cloud storage URL
        imageUrl: "", // Optional cover image
        createdAt: new Date(),
      };
      
      // Send to API
      const response = await apiRequest<MusicSample>("/api/music-samples", {
        method: "POST",
        body: JSON.stringify(sampleData),
      });
      
      // Update cache
      queryClient.invalidateQueries({queryKey: ['/api/music-samples']});
      
      toast({
        title: "Music sample uploaded",
        description: "Your music sample has been added to the library",
      });
      
      // Reset form
      setTitle("");
      setDescription("");
      setTags("");
      setDuration("3:00");
      setFileName(null);
      setFileUrl(null);
      
      // Call success callback if provided
      if (onSuccess && response) {
        onSuccess(response);
      }
    } catch (error) {
      console.error("Upload failed:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your music sample",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <motion.div
      variants={itemVariants}
      initial="initial"
      animate="animate"
    >
      <Card className="bg-gray-800/90 backdrop-blur-lg border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Upload AI Music</CardTitle>
          <CardDescription className="text-gray-300">
            Share your AI-generated music with the community
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Title
              </label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a title for your music"
                className="bg-gray-700 text-white border-gray-600 focus:border-[#00C2FF]"
                required
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                Description
              </label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What inspired this piece? How was it created?"
                className="bg-gray-700 text-white border-gray-600 focus:border-[#00C2FF]"
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-300 mb-1">
                Tags (comma separated)
              </label>
              <Input
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ambient, generative, electronic"
                className="bg-gray-700 text-white border-gray-600 focus:border-[#00C2FF]"
              />
            </div>
            
            <div>
              <label htmlFor="audioFile" className="block text-sm font-medium text-gray-300 mb-1">
                Audio File
              </label>
              
              {!fileName ? (
                <div className="flex items-center justify-center w-full">
                  <label 
                    htmlFor="audioFile" 
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Music className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">MP3, WAV, or OGG (up to 10MB)</p>
                    </div>
                    <input 
                      id="audioFile" 
                      type="file" 
                      className="hidden" 
                      accept="audio/*"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              ) : (
                <div className="flex items-center p-4 border border-gray-600 rounded-lg bg-gray-700">
                  <Music className="h-6 w-6 text-[#00C2FF] mr-3" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white truncate">{fileName}</p>
                    <p className="text-xs text-gray-400">Duration: {duration}</p>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleRemoveFile}
                    className="p-1 rounded-full hover:bg-gray-600"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              )}
              
              {fileUrl && (
                <div className="mt-2">
                  <audio controls className="w-full">
                    <source src={fileUrl} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </div>
          </form>
        </CardContent>
        
        <CardFooter>
          <Button 
            type="submit"
            className="w-full bg-gradient-to-r from-[#00C2FF] to-[#FF3366] hover:opacity-90"
            disabled={isUploading || !title || !fileUrl}
            onClick={handleSubmit}
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Uploading...
              </span>
            ) : (
              <span className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Upload Music
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default MusicUploader;