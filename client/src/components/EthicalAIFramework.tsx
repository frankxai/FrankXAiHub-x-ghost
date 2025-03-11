
import React from 'react';
import { Link } from 'react-router-dom';

const EthicalAIFramework: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Ethical AI Framework</h1>
        <p className="text-xl max-w-3xl mx-auto">
          Build AI systems that are not only powerful, but also ethical, transparent, and aligned with human values.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3">Privacy Protection</h2>
          <p className="text-gray-600">
            Implement AI systems that respect user privacy, secure sensitive data, and comply with global privacy regulations.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 4.5V6.5M19.5 12H17.5M12 17.5V19.5M6.5 12H4.5M16.95 7.05L15.536 8.464M15.536 15.536L16.95 16.95M7.05 16.95L8.464 15.536M8.464 8.464L7.05 7.05M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3">Transparency</h2>
          <p className="text-gray-600">
            Design AI systems that provide clear explanations for their decisions and maintain auditability across operations.
          </p>
        </div>
        
        <div className="flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-blue-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 14L11.5 16.5L17 11M12 6H21M12 12H21M12 18H21M3 6H4.5M3 12H4.5M3 18H4.5M6 6C6 6.82843 5.32843 7.5 4.5 7.5C3.67157 7.5 3 6.82843 3 6C3 5.17157 3.67157 4.5 4.5 4.5C5.32843 4.5 6 5.17157 6 6ZM6 12C6 12.8284 5.32843 13.5 4.5 13.5C3.67157 13.5 3 12.8284 3 12C3 11.1716 3.67157 10.5 4.5 10.5C5.32843 10.5 6 11.1716 6 12ZM6 18C6 18.8284 5.32843 19.5 4.5 19.5C3.67157 19.5 3 18.8284 3 18C3 17.1716 3.67157 16.5 4.5 16.5C5.32843 16.5 6 17.1716 6 18Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-3">Fairness & Inclusion</h2>
          <p className="text-gray-600">
            Build AI systems that avoid bias, promote diversity, and create equitable outcomes for all users.
          </p>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-xl p-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Our Ethical AI Assessment Process</h2>
        
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-1 bg-blue-200"></div>
            
            {[
              {
                title: "Ethical Risks Assessment",
                description: "Comprehensive evaluation of potential ethical risks in AI implementation"
              },
              {
                title: "Privacy Impact Analysis",
                description: "Detailed assessment of how AI systems interact with personal data"
              },
              {
                title: "Bias Detection & Mitigation",
                description: "Identifying and addressing potential biases in AI models and data"
              },
              {
                title: "Transparency Framework",
                description: "Establishing protocols for explainable AI and decision transparency"
              },
              {
                title: "Governance Structure",
                description: "Creating organizational oversight for ethical AI implementation"
              }
            ].map((step, index) => (
              <div key={index} className="relative z-10 flex mb-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0">
                  {index + 1}
                </div>
                <div className="ml-6 bg-white p-6 rounded-lg shadow-md flex-grow">
                  <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-16">
        <h2 className="text-2xl font-bold mb-8 text-center">Ethical AI Resources</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">AI Ethics Guidelines</h3>
              <p className="text-gray-600 mb-4">
                Comprehensive framework for implementing ethical considerations in AI development and deployment.
              </p>
              <Link 
                to="/resources/ai-ethics-guidelines"
                className="text-blue-600 hover:text-blue-800"
              >
                Download Guidelines →
              </Link>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Bias Detection Toolkit</h3>
              <p className="text-gray-600 mb-4">
                Tools and methodologies for identifying and mitigating bias in AI models and datasets.
              </p>
              <Link 
                to="/resources/bias-detection-toolkit"
                className="text-blue-600 hover:text-blue-800"
              >
                Access Toolkit →
              </Link>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Privacy-First AI Development</h3>
              <p className="text-gray-600 mb-4">
                Best practices for implementing AI systems that prioritize user privacy and data protection.
              </p>
              <Link 
                to="/resources/privacy-ai-development"
                className="text-blue-600 hover:text-blue-800"
              >
                View Resource →
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-blue-700 text-white rounded-xl p-8 text-center">
        <h2 className="text-3xl font-bold mb-4">Start Your Ethical AI Journey</h2>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Implement AI systems that are powerful, ethical, and aligned with your organizational values.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/assessment/ethics"
            className="px-6 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50"
          >
            Take Ethics Assessment
          </Link>
          <Link 
            to="/contact"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-500 border border-blue-500"
          >
            Request Consultation
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EthicalAIFramework;
