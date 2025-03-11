
import React from 'react';
import { Link } from 'react-router-dom';

const ValueLadder: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Your AI Transformation Journey</h1>
        <p className="text-xl max-w-3xl mx-auto">
          FrankX.AI empowers your organization at every stage of your AI journey - from exploration to implementation to scaling AI excellence.
        </p>
      </div>
      
      {/* Free Value Tier */}
      <div className="mb-24">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 transform -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-8">
              1
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-8 mb-16">
            <h2 className="text-3xl font-bold mb-4 text-center">Explore AI Possibilities</h2>
            <p className="text-lg text-center mb-8">
              Begin your AI journey with valuable free resources to guide your understanding and planning.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border rounded-lg p-6 flex flex-col">
                <h3 className="text-xl font-semibold mb-3">AI Maturity Assessment</h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Evaluate your organization's AI readiness across key dimensions with our comprehensive assessment tool.
                </p>
                <Link 
                  to="/assessment"
                  className="px-4 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700"
                >
                  Take Assessment
                </Link>
              </div>
              
              <div className="border rounded-lg p-6 flex flex-col">
                <h3 className="text-xl font-semibold mb-3">AI Strategy Guide</h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Download our comprehensive guide to developing an effective AI strategy aligned with business goals.
                </p>
                <Link 
                  to="/resources/ai-strategy-guide"
                  className="px-4 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700"
                >
                  Download Guide
                </Link>
              </div>
              
              <div className="border rounded-lg p-6 flex flex-col">
                <h3 className="text-xl font-semibold mb-3">Use Case Library</h3>
                <p className="text-gray-600 mb-4 flex-grow">
                  Explore curated AI use cases specific to your industry with implementation insights.
                </p>
                <Link 
                  to="/use-cases"
                  className="px-4 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700"
                >
                  Browse Use Cases
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Low-Tier Paid Value */}
      <div className="mb-24">
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-blue-200 transform -translate-x-1/2"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-8">
              2
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-8 mb-16">
            <h2 className="text-3xl font-bold mb-4 text-center">Implement AI Excellence</h2>
            <p className="text-lg text-center mb-8">
              Access specialized tools and AI agents to accelerate your implementation.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="border rounded-lg p-6 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold">AI Agents Access</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Basic Plan
                  </span>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">
                  Engage with specialized AI personas designed to assist with different aspects of your AI implementation.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold">$29</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <Link 
                  to="/pricing/basic"
                  className="px-4 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700"
                >
                  Choose Basic Plan
                </Link>
              </div>
              
              <div className="border rounded-lg p-6 flex flex-col relative">
                <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold">AI Roadmap Generator</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Standard Plan
                  </span>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">
                  Generate a customized AI implementation roadmap based on your assessment results and business goals.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold">$99</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <Link 
                  to="/pricing/standard"
                  className="px-4 py-2 bg-indigo-600 text-white rounded text-center hover:bg-indigo-700"
                >
                  Choose Standard Plan
                </Link>
              </div>
              
              <div className="border rounded-lg p-6 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold">Implementation Toolkit</h3>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    Premium Plan
                  </span>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">
                  Comprehensive set of templates, frameworks, and tools for successful AI implementation.
                </p>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold">$199</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <Link 
                  to="/pricing/premium"
                  className="px-4 py-2 bg-blue-600 text-white rounded text-center hover:bg-blue-700"
                >
                  Choose Premium Plan
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* High-Tier Value */}
      <div>
        <div className="max-w-5xl mx-auto relative">
          <div className="relative z-10">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-8">
              3
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-3xl font-bold mb-4 text-center">Accelerate & Scale AI Excellence</h2>
            <p className="text-lg text-center mb-8">
              Unlock the full potential of your AI Center of Excellence with enterprise-grade solutions.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border rounded-lg p-6 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold">Enterprise AI CoE Platform</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Enterprise Plan
                  </span>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">
                  Complete AI Center of Excellence platform with custom branding, unlimited users, and full feature access.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Custom AI governance framework
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    White-labeled AI agents
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Advanced analytics dashboard
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Enterprise SSO integration
                  </li>
                </ul>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold">Custom Pricing</span>
                </div>
                <Link 
                  to="/contact-sales"
                  className="px-4 py-2 bg-purple-600 text-white rounded text-center hover:bg-purple-700"
                >
                  Contact Sales
                </Link>
              </div>
              
              <div className="border rounded-lg p-6 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold">AI Transformation Advisory</h3>
                  <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">
                    Executive Service
                  </span>
                </div>
                <p className="text-gray-600 mb-4 flex-grow">
                  Comprehensive advisory services to guide your organization's entire AI transformation journey.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Expert AI strategy consultation
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    AI maturity acceleration program
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Executive AI education workshop
                  </li>
                  <li className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Custom AI governance framework
                  </li>
                </ul>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold">Custom Pricing</span>
                </div>
                <Link 
                  to="/executive-services"
                  className="px-4 py-2 bg-purple-600 text-white rounded text-center hover:bg-purple-700"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ValueLadder;
