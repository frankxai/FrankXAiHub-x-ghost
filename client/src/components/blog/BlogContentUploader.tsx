import { useState } from "react";
import { motion } from "framer-motion";
import { itemVariants } from "@/lib/animations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Image, Video, Upload, Link2, X, Music, File } from "lucide-react";

interface BlogContentUploaderProps {
  onContentAdded?: (content: {
    type: 'image' | 'video' | 'audio' | 'markdown' | 'link' | 'file';
    url: string;
    title?: string;
    description?: string;
  }) => void;
}

const BlogContentUploader = ({ onContentAdded }: BlogContentUploaderProps) => {
  const [activeTab, setActiveTab] = useState<string>("image");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [markdownContent, setMarkdownContent] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  
  const { toast } = useToast();
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Simple file size validation (under 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 50MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check file type based on active tab
      let isValidType = false;
      const fileType = file.type;
      
      if (activeTab === "image" && fileType.startsWith("image/")) {
        isValidType = true;
      } else if (activeTab === "video" && fileType.startsWith("video/")) {
        isValidType = true;
      } else if (activeTab === "audio" && fileType.startsWith("audio/")) {
        isValidType = true;
      } else if (activeTab === "file") {
        isValidType = true;
      }
      
      if (!isValidType) {
        toast({
          title: "Invalid file type",
          description: `Please upload a ${activeTab} file`,
          variant: "destructive",
        });
        return;
      }
      
      setFileName(file.name);
      
      // In a real implementation, we would upload to a cloud storage service
      // For now, create a temporary URL
      const tempUrl = URL.createObjectURL(file);
      setFileUrl(tempUrl);
    }
  };
  
  const handleRemoveFile = () => {
    setFileName(null);
    setFileUrl(null);
  };
  
  const handleAddContent = () => {
    if (activeTab === "link" && !linkUrl) {
      toast({
        title: "Missing URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }
    
    if (activeTab === "markdown" && !markdownContent) {
      toast({
        title: "Missing content",
        description: "Please enter some markdown content",
        variant: "destructive",
      });
      return;
    }
    
    if ((activeTab === "image" || activeTab === "video" || activeTab === "audio" || activeTab === "file") && !fileUrl) {
      toast({
        title: "Missing file",
        description: `Please upload a ${activeTab} file`,
        variant: "destructive",
      });
      return;
    }
    
    setIsUploading(true);
    
    setTimeout(() => {
      try {
        // Determine content type and URL based on active tab
        const contentType = activeTab as 'image' | 'video' | 'audio' | 'markdown' | 'link' | 'file';
        const contentUrl = activeTab === "link" 
          ? linkUrl 
          : activeTab === "markdown" 
            ? markdownContent 
            : fileUrl || "";
        
        // Call the callback with the content
        if (onContentAdded) {
          onContentAdded({
            type: contentType,
            url: contentUrl,
            title: title || undefined,
            description: description || undefined,
          });
        }
        
        // Show success message
        toast({
          title: "Content added",
          description: "Your content has been added to the blog post",
        });
        
        // Reset form
        setTitle("");
        setDescription("");
        setFileName(null);
        setFileUrl(null);
        setLinkUrl("");
        setMarkdownContent("");
      } catch (error) {
        console.error("Failed to add content:", error);
        toast({
          title: "Failed to add content",
          description: "There was an error adding your content",
          variant: "destructive",
        });
      } finally {
        setIsUploading(false);
      }
    }, 1000); // Simulate upload time
  };
  
  return (
    <motion.div
      variants={itemVariants}
      initial="initial"
      animate="animate"
    >
      <Card className="border border-slate-200 dark:border-slate-700">
        <CardHeader>
          <CardTitle>Add Content to Blog Post</CardTitle>
          <CardDescription>
            Upload media, add links, or write markdown content for your blog post
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 md:grid-cols-6">
              <TabsTrigger value="image" className="flex items-center">
                <Image className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Image</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex items-center">
                <Video className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Video</span>
              </TabsTrigger>
              <TabsTrigger value="audio" className="flex items-center">
                <Music className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Audio</span>
              </TabsTrigger>
              <TabsTrigger value="markdown" className="flex items-center">
                <FileText className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Markdown</span>
              </TabsTrigger>
              <TabsTrigger value="link" className="flex items-center">
                <Link2 className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Link</span>
              </TabsTrigger>
              <TabsTrigger value="file" className="flex items-center">
                <File className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">File</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="mt-6 space-y-4">
              {/* Common fields for all content types */}
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-1">
                  Title (optional)
                </label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter a title for this content"
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-1">
                  Description (optional)
                </label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter a brief description"
                  rows={2}
                />
              </div>
              
              {/* Tab-specific content */}
              <TabsContent value="image" className="mt-4 space-y-4">
                {!fileName ? (
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="imageUpload" 
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Image className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PNG, JPG, GIF, WEBP</p>
                      </div>
                      <input 
                        id="imageUpload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm truncate">{fileName}</p>
                      <button 
                        type="button" 
                        onClick={handleRemoveFile}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {fileUrl && (
                      <div className="max-h-48 overflow-hidden rounded-lg">
                        <img 
                          src={fileUrl} 
                          alt="Preview" 
                          className="w-full h-auto object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="video" className="mt-4 space-y-4">
                {!fileName ? (
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="videoUpload" 
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Video className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">MP4, WEBM, MOV</p>
                      </div>
                      <input 
                        id="videoUpload" 
                        type="file" 
                        className="hidden" 
                        accept="video/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm truncate">{fileName}</p>
                      <button 
                        type="button" 
                        onClick={handleRemoveFile}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {fileUrl && (
                      <div className="rounded-lg overflow-hidden">
                        <video controls className="w-full">
                          <source src={fileUrl} />
                          Your browser does not support the video tag.
                        </video>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="audio" className="mt-4 space-y-4">
                {!fileName ? (
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="audioUpload" 
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Music className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">MP3, WAV, OGG</p>
                      </div>
                      <input 
                        id="audioUpload" 
                        type="file" 
                        className="hidden" 
                        accept="audio/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm truncate">{fileName}</p>
                      <button 
                        type="button" 
                        onClick={handleRemoveFile}
                        className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    {fileUrl && (
                      <audio controls className="w-full">
                        <source src={fileUrl} />
                        Your browser does not support the audio element.
                      </audio>
                    )}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="markdown" className="mt-4 space-y-4">
                <div>
                  <label htmlFor="markdown" className="block text-sm font-medium mb-1">
                    Markdown Content
                  </label>
                  <Textarea
                    id="markdown"
                    value={markdownContent}
                    onChange={(e) => setMarkdownContent(e.target.value)}
                    placeholder="# Your Markdown Here\n\nWrite your content using markdown syntax"
                    rows={8}
                    className="font-mono"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="link" className="mt-4 space-y-4">
                <div>
                  <label htmlFor="link" className="block text-sm font-medium mb-1">
                    Link URL
                  </label>
                  <Input
                    id="link"
                    type="url"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="file" className="mt-4 space-y-4">
                {!fileName ? (
                  <div className="flex items-center justify-center w-full">
                    <label 
                      htmlFor="fileUpload" 
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <File className="w-10 h-10 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">PDF, DOCX, XLSX, etc.</p>
                      </div>
                      <input 
                        id="fileUpload" 
                        type="file" 
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                ) : (
                  <div className="flex items-center p-4 border rounded-lg">
                    <File className="h-8 w-8 mr-3 text-blue-500" />
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{fileName}</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleRemoveFile}
                      className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleAddContent}
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-[#00C2FF] to-[#FF3366] hover:opacity-90 text-white"
          >
            {isUploading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : (
              <span className="flex items-center">
                <Upload className="mr-2 h-4 w-4" />
                Add Content to Blog
              </span>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default BlogContentUploader;