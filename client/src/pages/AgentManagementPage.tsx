
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info, Shield } from 'lucide-react';

// Sample user ID - in a real app, this would come from auth
const CURRENT_USER_ID = 1;

interface AgentTemplate {
  name: string;
  systemPrompt: string;
  model?: string;
  provider?: string;
}

interface Agent {
  id: number;
  name: string;
  description: string;
  persona: string;
  avatarUrl: string;
  capabilities: string[];
  model: string;
  provider: string;
  icon: string;
  featured: boolean;
}

interface PrivacyControl {
  name: string;
  label: string;
  type: string;
  options?: number[];
  default: any;
  description: string;
}

interface LegalInfo {
  disclaimer: string;
  privacyControls: PrivacyControl[];
}

const AgentManagementPage: React.FC = () => {
  const [templates, setTemplates] = useState<AgentTemplate[]>([]);
  const [publicAgents, setPublicAgents] = useState<Agent[]>([]);
  const [customAgents, setCustomAgents] = useState<Agent[]>([]);
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [legalInfo, setLegalInfo] = useState<LegalInfo | null>(null);
  const [legalAccepted, setLegalAccepted] = useState(false);
  const navigate = useNavigate();
  
  // Form state for creating a new agent
  const [newAgent, setNewAgent] = useState({
    name: '',
    description: '',
    persona: '',
    systemPrompt: '',
    model: 'gpt-4-turbo-preview',
    provider: 'openai',
    isPublic: false,
    capabilities: [],
    dataRetention: 7,
    allowLearning: false
  });
  
  // File upload state
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  
  useEffect(() => {
    // Fetch available templates
    fetch('/api/agent-management/templates')
      .then(res => res.json())
      .then(data => setTemplates(data))
      .catch(err => console.error('Error fetching templates:', err));
    
    // Fetch public agents
    fetch('/api/agent-management/public')
      .then(res => res.json())
      .then(data => setPublicAgents(data))
      .catch(err => console.error('Error fetching public agents:', err));
    
    // Fetch user's custom agents
    fetch(`/api/agent-management/custom/${CURRENT_USER_ID}`)
      .then(res => res.json())
      .then(data => setCustomAgents(data))
      .catch(err => console.error('Error fetching custom agents:', err));
    
    // Fetch legal info
    fetch('/api/agent-management/legal')
      .then(res => res.json())
      .then(data => setLegalInfo(data))
      .catch(err => console.error('Error fetching legal info:', err));
  }, []);
  
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
    const template = templates.find(t => t.name === value);
    
    if (template) {
      setNewAgent({
        ...newAgent,
        name: template.name,
        persona: template.systemPrompt,
        systemPrompt: template.systemPrompt,
        model: template.model || 'gpt-4-turbo-preview',
        provider: template.provider || 'openai'
      });
    }
  };
  
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!legalAccepted) {
      toast.error('You must accept the legal disclaimer to create an agent');
      return;
    }
    
    try {
      const formData = new FormData();
      formData.append('data', JSON.stringify({
        ...newAgent,
        legalDisclaimer: legalAccepted
      }));
      
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }
      
      const response = await fetch('/api/agent-management', {
        method: 'POST',
        body: formData
      });
      
      if (!response.ok) {
        throw new Error('Failed to create agent');
      }
      
      const data = await response.json();
      toast.success('Agent created successfully!');
      
      // Update the list of custom agents
      setCustomAgents([...customAgents, data]);
      
      // Reset form
      setNewAgent({
        name: '',
        description: '',
        persona: '',
        systemPrompt: '',
        model: 'gpt-4-turbo-preview',
        provider: 'openai',
        isPublic: false,
        capabilities: [],
        dataRetention: 7,
        allowLearning: false
      });
      setAvatarFile(null);
      setAvatarPreview('');
      setSelectedTemplate('');
      setLegalAccepted(false);
      
      // Switch to "My Agents" tab
      setActiveTab('myAgents');
    } catch (error) {
      toast.error('Error creating agent');
      console.error('Error creating agent:', error);
    }
  };
  
  const handleConversationStart = (agentId: number) => {
    navigate(`/chat/${agentId}`);
  };
  
  return (
    <div className="container max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">FrankX.AI Agent Management</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-8">
          <TabsTrigger value="browse">Browse Agents</TabsTrigger>
          <TabsTrigger value="myAgents">My Agents</TabsTrigger>
          <TabsTrigger value="create">Create New Agent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="browse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publicAgents.map(agent => (
              <Card key={agent.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-muted overflow-hidden">
                  <img 
                    src={agent.avatarUrl} 
                    alt={agent.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{agent.name}</CardTitle>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {agent.capabilities.map((capability, idx) => (
                      <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {capability}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Model: {agent.model}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleConversationStart(agent.id)}
                    className="w-full"
                  >
                    Start Conversation
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {publicAgents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No public agents available</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="myAgents">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customAgents.map(agent => (
              <Card key={agent.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-muted overflow-hidden">
                  <img 
                    src={agent.avatarUrl} 
                    alt={agent.name} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{agent.name}</CardTitle>
                  <CardDescription>{agent.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {agent.capabilities.map((capability, idx) => (
                      <span key={idx} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {capability}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Model: {agent.model}
                  </p>
                </CardContent>
                <CardFooter className="flex gap-2">
                  <Button 
                    onClick={() => handleConversationStart(agent.id)}
                    className="flex-1"
                  >
                    Start Conversation
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Edit
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {customAgents.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">You haven't created any agents yet</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setActiveTab('create')}
              >
                Create Your First Agent
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="create">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="template" className="block text-sm font-medium">
                        Start from a Template (Optional)
                      </label>
                      <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Custom Agent (Start from scratch)</SelectItem>
                          {templates.map((template, idx) => (
                            <SelectItem key={idx} value={template.name}>
                              {template.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="name" className="block text-sm font-medium">
                        Agent Name*
                      </label>
                      <Input 
                        id="name" 
                        value={newAgent.name}
                        onChange={e => setNewAgent({...newAgent, name: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="description" className="block text-sm font-medium">
                        Description*
                      </label>
                      <Textarea 
                        id="description" 
                        value={newAgent.description}
                        onChange={e => setNewAgent({...newAgent, description: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="avatar" className="block text-sm font-medium">
                        Avatar Image
                      </label>
                      <Input 
                        id="avatar" 
                        type="file" 
                        accept="image/*"
                        onChange={handleAvatarChange}
                      />
                      {avatarPreview && (
                        <div className="mt-2 w-32 h-32 rounded-full overflow-hidden border">
                          <img 
                            src={avatarPreview} 
                            alt="Avatar preview" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">AI Configuration</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="model" className="block text-sm font-medium">
                        AI Model
                      </label>
                      <Select 
                        value={newAgent.model} 
                        onValueChange={(value) => setNewAgent({...newAgent, model: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4-turbo-preview">GPT-4 Turbo</SelectItem>
                          <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                          <SelectItem value="anthropic/claude-3-opus">Claude 3 Opus</SelectItem>
                          <SelectItem value="anthropic/claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                          <SelectItem value="anthropic/claude-3-haiku">Claude 3 Haiku</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="provider" className="block text-sm font-medium">
                        Provider
                      </label>
                      <Select 
                        value={newAgent.provider} 
                        onValueChange={(value) => setNewAgent({...newAgent, provider: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select provider" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI</SelectItem>
                          <SelectItem value="openrouter">OpenRouter</SelectItem>
                          <SelectItem value="mock">Mock (Testing)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="capabilities" className="block text-sm font-medium">
                        Capabilities (comma separated)
                      </label>
                      <Input 
                        id="capabilities" 
                        placeholder="e.g., Strategy, Analysis, Recommendations"
                        onChange={e => setNewAgent({
                          ...newAgent, 
                          capabilities: e.target.value.split(',').map(c => c.trim()).filter(Boolean)
                        })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-4">Agent Personality</h2>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="systemPrompt" className="block text-sm font-medium">
                        System Prompt / Persona*
                      </label>
                      <Textarea 
                        id="systemPrompt" 
                        value={newAgent.systemPrompt || newAgent.persona}
                        onChange={e => setNewAgent({...newAgent, systemPrompt: e.target.value, persona: e.target.value})}
                        className="h-64"
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        This defines your agent's personality, knowledge, and behavior.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h2 className="text-xl font-semibold mb-4">Privacy & Sharing</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="isPublic" className="text-sm font-medium">
                          Share with other users
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Make this agent available to others on the platform
                        </p>
                      </div>
                      <Switch 
                        id="isPublic"
                        checked={newAgent.isPublic}
                        onCheckedChange={(checked) => setNewAgent({...newAgent, isPublic: checked})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="dataRetention" className="block text-sm font-medium">
                        Data Retention Period (days)
                      </label>
                      <Select 
                        value={newAgent.dataRetention.toString()} 
                        onValueChange={(value) => setNewAgent({...newAgent, dataRetention: parseInt(value)})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select retention period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0">No retention (conversations not saved)</SelectItem>
                          <SelectItem value="1">1 day</SelectItem>
                          <SelectItem value="7">7 days</SelectItem>
                          <SelectItem value="30">30 days</SelectItem>
                          <SelectItem value="90">90 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label htmlFor="allowLearning" className="text-sm font-medium">
                          Allow learning from conversations
                        </label>
                        <p className="text-xs text-muted-foreground">
                          System may learn from anonymized conversations to improve
                        </p>
                      </div>
                      <Switch 
                        id="allowLearning"
                        checked={newAgent.allowLearning}
                        onCheckedChange={(checked) => setNewAgent({...newAgent, allowLearning: checked})}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Alert className="bg-muted/50">
                    <Shield className="h-4 w-4" />
                    <AlertTitle>Legal Disclaimer</AlertTitle>
                    <AlertDescription className="mt-4">
                      <div className="max-h-60 overflow-y-auto p-4 bg-muted/30 rounded-md text-sm">
                        {legalInfo?.disclaimer ? (
                          <div dangerouslySetInnerHTML={{ __html: legalInfo.disclaimer.replace(/\n/g, '<br/>') }} />
                        ) : (
                          <p>Loading disclaimer...</p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 mt-4">
                        <Checkbox 
                          id="legal-acceptance" 
                          checked={legalAccepted}
                          onCheckedChange={(checked) => setLegalAccepted(checked as boolean)}
                        />
                        <label
                          htmlFor="legal-acceptance"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I accept the legal disclaimer and privacy policy
                        </label>
                      </div>
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button type="submit" size="lg">
                Create Agent
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentManagementPage;
