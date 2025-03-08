
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Loader2, FileText, Download, Copy, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface ConversionResult {
  fileName: string;
  markdown: string;
  originalName: string;
}

const FileConverter: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [results, setResults] = useState<ConversionResult[]>([]);
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'text/html': ['.html'],
      'text/csv': ['.csv'],
      'application/json': ['.json'],
      'application/xml': ['.xml'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
      'audio/*': ['.mp3', '.wav', '.m4a'],
      'application/zip': ['.zip']
    }
  });

  const handleConvert = async () => {
    if (files.length === 0) {
      setError('Please select at least one file to convert');
      return;
    }

    setIsConverting(true);
    setError(null);
    
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('File conversion failed');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Error converting files:', error);
      setError('Failed to convert files. Please try again.');
    } finally {
      setIsConverting(false);
    }
  };

  const handleDownload = (result: ConversionResult) => {
    const blob = new Blob([result.markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${result.originalName}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = (result: ConversionResult) => {
    navigator.clipboard.writeText(result.markdown)
      .then(() => {
        // You could add a toast notification here
        console.log('Copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy:', err);
      });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">AI Document Converter</CardTitle>
        <CardDescription>
          Convert office documents, PDFs, images and more to Markdown with AI assistance
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div 
          {...getRootProps()} 
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/5' : 'border-border'
          }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center gap-2">
            <Upload size={32} className="text-muted-foreground" />
            {isDragActive ? (
              <p className="text-primary font-medium">Drop the files here...</p>
            ) : (
              <>
                <p className="font-medium">Drag & drop files here, or click to select files</p>
                <p className="text-sm text-muted-foreground">
                  Supports PDF, Word, PowerPoint, Excel, HTML, Images, Audio, and more
                </p>
              </>
            )}
          </div>
        </div>

        {files.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium mb-2">Selected Files ({files.length})</h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center p-2 bg-muted rounded">
                  <FileText size={16} className="mr-2" />
                  <span className="text-sm truncate flex-1">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </span>
                </div>
              ))}
            </div>
            <Button 
              onClick={handleConvert} 
              disabled={isConverting}
              className="mt-4 w-full"
            >
              {isConverting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                'Convert to Markdown'
              )}
            </Button>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded">
            {error}
          </div>
        )}

        {results.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Conversion Results</h3>
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between p-3 bg-muted">
                    <span className="font-medium">{result.originalName}</span>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleCopy(result)}
                      >
                        <Copy size={16} className="mr-2" />
                        Copy
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => handleDownload(result)}
                      >
                        <Download size={16} className="mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                  <div className="p-3 max-h-64 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap">{result.markdown}</pre>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileConverter;
