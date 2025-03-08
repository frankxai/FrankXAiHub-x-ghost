
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import PageHeader from '@/components/layout/PageHeader';
import FileConverter from '@/components/resource/FileConverter';

const FileConversionPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="container max-w-6xl py-8">
        <PageHeader
          title="AI Document Converter"
          description="Convert various document formats to Markdown using AI-powered extraction and processing"
          className="mb-8"
        />
        
        <FileConverter />
        
        <div className="mt-12 prose dark:prose-invert max-w-none">
          <h2>How It Works</h2>
          <p>
            Our AI-powered document converter uses advanced natural language processing and 
            computer vision techniques to extract and structure content from various file formats.
          </p>
          
          <h3>Supported File Types</h3>
          <ul>
            <li><strong>Documents:</strong> PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx)</li>
            <li><strong>Images:</strong> JPG, PNG, GIF (with OCR text extraction)</li>
            <li><strong>Audio:</strong> MP3, WAV, M4A (with speech-to-text transcription)</li>
            <li><strong>Web:</strong> HTML pages</li>
            <li><strong>Data:</strong> CSV, JSON, XML</li>
            <li><strong>Archives:</strong> ZIP (processes contained files)</li>
          </ul>
          
          <h3>Benefits</h3>
          <ul>
            <li>Extract text while preserving document structure</li>
            <li>Convert complex document formats to clean, portable Markdown</li>
            <li>Make document content ready for AI analysis and processing</li>
            <li>Prepare content for knowledge bases and documentation systems</li>
          </ul>
          
          <p className="text-sm mt-8 text-muted-foreground">
            <em>Powered by FrankX.AI's document intelligence capabilities</em>
          </p>
        </div>
      </div>
    </MainLayout>
  );
};

export default FileConversionPage;
