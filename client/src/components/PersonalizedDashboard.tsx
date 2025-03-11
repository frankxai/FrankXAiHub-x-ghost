
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface OnboardingData {
  segment?: string;
  industry?: string;
  organizationSize?: string;
  aiMaturity?: string;
  primaryGoal?: string;
  aiChallenges?: string[];
}

const PersonalizedDashboard: React.FC = () => {
  const [userData, setUserData] = useState<OnboardingData>({});
  const [recommendedAgents, setRecommendedAgents] = useState<any[]>([]);
  const [recommendedResources, setRecommendedResources] = useState<any[]>([]);
  const [availableCredits, setAvailableCredits] = useState(100);
  
  useEffect(() => {
    // Load user onboarding data
    const storedData = localStorage.getItem('frankxOnboardingData');
    if (storedData) {
      setUserData(JSON.parse(storedData));
    }
    
    // Fetch recommended agents based on user profile
    fetch('/api/recommendations/agents')
      .then(res => res.json())
      .then(data => setRecommendedAgents(data))
      .catch(err => console.error('Error fetching recommended agents:', err));
      
    // Fetch recommended resources based on user profile
    fetch('/api/recommendations/resources')
      .then(res => res.json())
      .then(data => setRecommendedResources(data))
      .catch(err => console.error('Error fetching recommended resources:', err));
  }, []);
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-lg p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome to Your AI Center of Excellence</h1>
        <p className="text-xl mb-4">
          Personalized for {userData.segment} in {userData.industry} ({userData.organizationSize})
        </p>
        <p className="mb-6">
          Your goal: {userData.primaryGoal}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <span className="text-3xl font-bold block">{availableCredits}</span>
            <span>Available Credits</span>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <span className="text-3xl font-bold block">3</span>
            <span>AI Conversations</span>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <span className="text-3xl font-bold block">7</span>
            <span>Resources Accessed</span>
          </div>
          <div className="bg-white bg-opacity-20 p-4 rounded-lg">
            <span className="text-3xl font-bold block">{userData.aiMaturity}</span>
            <span>AI Maturity Stage</span>
          </div>
        </div>
      </div>
      
      {/* AI Maturity Path */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Your AI Maturity Path</h2>
        <div className="relative">
          <div className="h-2 bg-gray-200 rounded-full">
            <div 
              className="h-full bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: userData.aiMaturity === 'exploring' ? '25%' : 
                      userData.aiMaturity === 'implementing' ? '50%' :
                      userData.aiMaturity === 'scaling' ? '75%' : '100%' }}
            ></div>
          </div>
          <div className="flex justify-between mt-2">
            <div className={`text-center ${userData.aiMaturity === 'exploring' ? 'text-blue-600 font-bold' : ''}`}>
              Exploring
            </div>
            <div className={`text-center ${userData.aiMaturity === 'implementing' ? 'text-blue-600 font-bold' : ''}`}>
              Implementing
            </div>
            <div className={`text-center ${userData.aiMaturity === 'scaling' ? 'text-blue-600 font-bold' : ''}`}>
              Scaling
            </div>
            <div className={`text-center ${userData.aiMaturity === 'optimizing' ? 'text-blue-600 font-bold' : ''}`}>
              Optimizing
            </div>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Next Steps</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">1</span>
                Complete AI Maturity Assessment
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">2</span>
                Create your AI Roadmap
              </li>
              <li className="flex items-center">
                <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-3">3</span>
                Identify pilot projects
              </li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Recommended Tools</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                </svg>
                AI Center of Excellence Playbook
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                </svg>
                Industry-specific Use Case Library
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"></path>
                </svg>
                AI Implementation Framework
              </li>
            </ul>
          </div>
          
          <div className="border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-3">Challenge Solutions</h3>
            <div className="space-y-3">
              {userData.aiChallenges?.map((challenge, index) => (
                <div key={index} className="bg-blue-50 p-3 rounded">
                  <span className="font-medium text-blue-700">{challenge}</span>
                  <Link to="/resources" className="block text-sm text-blue-600 mt-1">
                    View resources →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Recommended AI Personas */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Recommended AI Agents</h2>
          <Link to="/ai-agents" className="text-blue-600">
            View all agents →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommendedAgents.length > 0 ? recommendedAgents.map((agent, index) => (
            <div key={index} className="border rounded-lg p-6 flex flex-col">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full mr-4"></div>
                <div>
                  <h3 className="font-semibold">{agent.name}</h3>
                  <p className="text-sm text-gray-600">{agent.role}</p>
                </div>
              </div>
              <p className="text-gray-700 mb-4 flex-grow">{agent.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">{agent.credits} credits/conversation</span>
                <Link 
                  to={`/chat-with-agent/${agent.id}`}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Chat Now
                </Link>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-8 border rounded-lg">
              <p>Loading recommended agents...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Resource Library */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Personalized Resource Library</h2>
          <Link to="/resources" className="text-blue-600">
            View all resources →
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedResources.length > 0 ? recommendedResources.map((resource, index) => (
            <div key={index} className="border rounded-lg overflow-hidden">
              <div className="h-40 bg-gray-200"></div>
              <div className="p-5">
                <h3 className="font-semibold mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{resource.type}</span>
                  <Link 
                    to={`/resources/${resource.id}`}
                    className="text-blue-600"
                  >
                    Access Resource →
                  </Link>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-3 text-center py-8 border rounded-lg">
              <p>Loading recommended resources...</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Credit System */}
      <div className="border rounded-lg p-6 mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">AI Credit System</h2>
          <Link to="/credits" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Purchase Credits
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-3">Your Credit Balance</h3>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold mr-4">
                {availableCredits}
              </div>
              <div>
                <p>Available credits</p>
                <p className="text-sm text-gray-600">Updated 2 hours ago</p>
              </div>
            </div>
            
            <h4 className="font-medium mb-2">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Chat with StrategyGPT</span>
                <span className="text-red-600">-5 credits</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Generated AI Roadmap</span>
                <span className="text-red-600">-10 credits</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shared resource with team</span>
                <span className="text-green-600">+2 credits</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Ways to Earn Credits</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Complete your AI maturity assessment</p>
                  <p className="text-sm text-gray-600">Earn 25 credits</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Share resources with your team</p>
                  <p className="text-sm text-gray-600">Earn 2 credits per share</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Contribute a case study</p>
                  <p className="text-sm text-gray-600">Earn 50 credits</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="font-medium">Refer a colleague</p>
                  <p className="text-sm text-gray-600">Earn 100 credits for each referral</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* AI Governance Framework */}
      <div className="border rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">AI Ethics & Governance Framework</h2>
        <p className="mb-6">Ensure your AI implementation follows ethical principles and industry best practices.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Privacy Protection</h3>
            <p className="text-sm text-gray-600 mb-3">Learn how to implement AI while protecting user data and privacy.</p>
            <Link to="/ai-ethics/privacy" className="text-blue-600 text-sm">
              Privacy guidelines →
            </Link>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Ethical AI Development</h3>
            <p className="text-sm text-gray-600 mb-3">Frameworks for responsible AI development and deployment.</p>
            <Link to="/ai-ethics/ethics" className="text-blue-600 text-sm">
              Ethics checklist →
            </Link>
          </div>
          
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Governance Structure</h3>
            <p className="text-sm text-gray-600 mb-3">Build an effective AI governance structure for your organization.</p>
            <Link to="/ai-ethics/governance" className="text-blue-600 text-sm">
              Governance templates →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalizedDashboard;
