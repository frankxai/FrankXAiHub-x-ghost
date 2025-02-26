
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload, Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onFileUploaded: (fileUrl: string) => void;
  acceptedFileTypes?: string;
}

const FileUploader = ({ 
  onFileUploaded, 
  acceptedFileTypes = ".pdf,.zip,.docx,.xlsx,.pptx" 
}: FileUploaderProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setUploadError(null);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 5;
        });
      }, 200);
      
      // In a real implementation, you would send the file to your server
      // For now, we'll simulate a successful upload after a delay
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        
        // Construct a mock URL for the uploaded file
        const fileUrl = `/resources/${file.name}`;
        onFileUploaded(fileUrl);
        
        // Reset the uploader
        setTimeout(() => {
          setIsUploading(false);
          setFile(null);
        }, 1000);
      }, 3000);
    } catch (error) {
      setUploadError('Error uploading file. Please try again.');
      setIsUploading(false);
    }
  };
  
  const resetUploader = () => {
    setFile(null);
    setUploadError(null);
    setUploadProgress(0);
  };
  
  return (
    <div className="space-y-4">
      {!file ? (
        <div className="border-2 border-dashed border-border rounded-md p-6 text-center">
          <Upload className="w-10 h-10 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-medium mb-2">Upload a file</p>
          <p className="text-sm text-muted-foreground mb-4">
            Drag and drop or click to browse
          </p>
          <input
            type="file"
            id="file-upload"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Select File
          </Button>
        </div>
      ) : (
        <div className="border rounded-md p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-md bg-secondary/10 text-secondary flex items-center justify-center mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm truncate max-w-[200px]">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            {!isUploading && (
              <Button
                size="icon"
                variant="ghost"
                onClick={resetUploader}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {isUploading ? (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-right text-muted-foreground">
                {uploadProgress}% uploaded
              </p>
            </div>
          ) : (
            <Button 
              onClick={handleUpload}
              className="w-full"
              disabled={isUploading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          )}
          
          {uploadError && (
            <p className="text-destructive text-sm mt-2">{uploadError}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
