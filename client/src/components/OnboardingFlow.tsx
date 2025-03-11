
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// User segments based on needs and expertise
type UserSegment = 'executive' | 'technical' | 'business' | 'beginner' | 'expert';
type IndustryType = 'finance' | 'healthcare' | 'manufacturing' | 'retail' | 'technology' | 'other';
type OrganizationSize = 'startup' | 'small' | 'medium' | 'enterprise';
type AIMaturity = 'exploring' | 'implementing' | 'scaling' | 'optimizing';

interface OnboardingData {
  segment?: UserSegment;
  industry?: IndustryType;
  organizationSize?: OrganizationSize;
  aiMaturity?: AIMaturity;
  primaryGoal?: string;
  aiChallenges?: string[];
}

const OnboardingFlow: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({});
  
  const handleSegmentSelection = (segment: UserSegment) => {
    setData({...data, segment});
    setStep(2);
  };
  
  const handleIndustrySelection = (industry: IndustryType) => {
    setData({...data, industry});
    setStep(3);
  };
  
  const handleSizeSelection = (size: OrganizationSize) => {
    setData({...data, organizationSize: size});
    setStep(4);
  };
  
  const handleMaturitySelection = (maturity: AIMaturity) => {
    setData({...data, aiMaturity: maturity});
    setStep(5);
  };
  
  const handleGoalInput = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setData({...data, primaryGoal: formData.get('primaryGoal') as string});
    setStep(6);
  };
  
  const handleChallengesSelection = (challenges: string[]) => {
    setData({...data, aiChallenges: challenges});
    
    // Store the onboarding data in localStorage
    localStorage.setItem('frankxOnboardingData', JSON.stringify(data));
    
    // Redirect to personalized dashboard
    navigate('/personalized-dashboard');
  };
  
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4, 5, 6].map(stepNumber => (
            <div 
              key={stepNumber}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
            >
              {stepNumber}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${(step - 1) * 20}%` }}
          ></div>
        </div>
      </div>
      
      {step === 1 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">What best describes your role?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => handleSegmentSelection('executive')}
              className="p-6 border rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Executive</h3>
              <p className="text-gray-600">Strategic decision-making and leadership roles</p>
            </button>
            <button 
              onClick={() => handleSegmentSelection('technical')}
              className="p-6 border rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Technical Leader</h3>
              <p className="text-gray-600">Technology implementation and development</p>
            </button>
            <button 
              onClick={() => handleSegmentSelection('business')}
              className="p-6 border rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Business User</h3>
              <p className="text-gray-600">Applying AI to business processes</p>
            </button>
            <button 
              onClick={() => handleSegmentSelection('beginner')}
              className="p-6 border rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">AI Beginner</h3>
              <p className="text-gray-600">New to AI and exploring possibilities</p>
            </button>
          </div>
        </div>
      )}
      
      {step === 2 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Select your industry</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {['finance', 'healthcare', 'manufacturing', 'retail', 'technology', 'other'].map(industry => (
              <button 
                key={industry}
                onClick={() => handleIndustrySelection(industry as IndustryType)}
                className="p-4 border rounded-lg hover:bg-blue-50 transition capitalize"
              >
                {industry}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {step === 3 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">Organization Size</h2>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => handleSizeSelection('startup')}
              className="p-6 border rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Startup</h3>
              <p className="text-gray-600">1-20 employees</p>
            </button>
            <button 
              onClick={() => handleSizeSelection('small')}
              className="p-6 border rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Small Business</h3>
              <p className="text-gray-600">21-100 employees</p>
            </button>
            <button 
              onClick={() => handleSizeSelection('medium')}
              className="p-6 border rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Medium Business</h3>
              <p className="text-gray-600">101-1000 employees</p>
            </button>
            <button 
              onClick={() => handleSizeSelection('enterprise')}
              className="p-6 border rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-gray-600">1000+ employees</p>
            </button>
          </div>
        </div>
      )}
      
      {step === 4 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">AI Maturity Level</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={() => handleMaturitySelection('exploring')}
              className="p-6 border rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Exploring</h3>
              <p className="text-gray-600">Researching AI possibilities</p>
            </button>
            <button 
              onClick={() => handleMaturitySelection('implementing')}
              className="p-6 border rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Implementing</h3>
              <p className="text-gray-600">Initial AI projects underway</p>
            </button>
            <button 
              onClick={() => handleMaturitySelection('scaling')}
              className="p-6 border rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Scaling</h3>
              <p className="text-gray-600">Expanding successful AI initiatives</p>
            </button>
            <button 
              onClick={() => handleMaturitySelection('optimizing')}
              className="p-6 border rounded-lg hover:bg-blue-50 transition"
            >
              <h3 className="text-xl font-semibold mb-2">Optimizing</h3>
              <p className="text-gray-600">Advanced AI implementation</p>
            </button>
          </div>
        </div>
      )}
      
      {step === 5 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">What's your primary goal with AI?</h2>
          <form onSubmit={handleGoalInput} className="max-w-md mx-auto">
            <textarea 
              name="primaryGoal"
              className="w-full p-4 border rounded-lg h-32 mb-4"
              placeholder="e.g., Cut operational costs by 30%, automate customer service, improve product quality..."
              required
            ></textarea>
            <button 
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Continue
            </button>
          </form>
        </div>
      )}
      
      {step === 6 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-6">What challenges are you facing with AI?</h2>
          <div className="max-w-md mx-auto">
            <div className="grid grid-cols-1 gap-2 mb-6">
              {[
                'Finding qualified talent',
                'Data quality and access',
                'Integration with existing systems',
                'Measuring ROI',
                'Ethics and compliance',
                'Selecting the right technology',
                'User adoption',
                'Budget constraints'
              ].map(challenge => (
                <label key={challenge} className="flex items-center p-3 border rounded-lg">
                  <input 
                    type="checkbox" 
                    className="mr-3"
                    onChange={(e) => {
                      const current = data.aiChallenges || [];
                      if (e.target.checked) {
                        setData({...data, aiChallenges: [...current, challenge]});
                      } else {
                        setData({...data, aiChallenges: current.filter(c => c !== challenge)});
                      }
                    }}
                  />
                  {challenge}
                </label>
              ))}
            </div>
            <button 
              onClick={() => handleChallengesSelection(data.aiChallenges || [])}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Complete & View Personalized Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingFlow;
