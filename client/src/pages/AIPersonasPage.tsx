
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Plus, Edit, Trash, MessageSquare, CopyPlus } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { pageVariants, fadeIn } from '@/lib/animations';

interface AIPersona {
  name: string;
  systemPrompt: string;
  model?: string;
  provider?: string;
  description?: string;
  avatarUrl?: string;
  isCustom?: boolean;
  createdBy?: string;
}

const availableModels = [
  // OpenAI models
  { id: 'openai/gpt-4o', name: 'GPT-4o', provider: 'openai' },
  { id: 'openai/gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai' },
  { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' },
  
  // Anthropic models
  { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', provider: 'openrouter' },
  { id: 'anthropic/claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'openrouter' },
  { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'openrouter' },
  
  // Meta models
  { id: 'meta-llama/llama-3-70b-instruct', name: 'Llama 3 70B', provider: 'openrouter' },
  
  // Mistral models
  { id: 'mistralai/mistral-large', name: 'Mistral Large', provider: 'openrouter' },
];

const AIPersonasPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<AIPersona>>({
    name: '',
    systemPrompt: '',
    model: 'openai/gpt-4o',
    provider: 'openai',
    description: '',
    avatarUrl: '',
  });
  
  // Fetch all personas
  const { data: personas, isLoading } = useQuery({
    queryKey: ['/api/ai/personas'],
    select: (data: AIPersona[]) => data,
  });
  
  // Create persona mutation
  const createPersona = useMutation({
    mutationFn: async (data: Partial<AIPersona>) => {
      const response = await fetch('/api/ai/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          isCustom: true,
          createdBy: 'user', // In a real app, use the actual user ID
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create persona');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/personas'] });
      toast.success('Persona created successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to create persona: ${error.message}`);
    },
  });
  
  // Update persona mutation
  const updatePersona = useMutation({
    mutationFn: async ({ id, data }: { id: string, data: Partial<AIPersona> }) => {
      const response = await fetch(`/api/ai/personas/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update persona');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/personas'] });
      toast.success('Persona updated successfully');
      resetForm();
    },
    onError: (error) => {
      toast.error(`Failed to update persona: ${error.message}`);
    },
  });
  
  // Delete persona mutation
  const deletePersona = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`/api/ai/personas/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete persona');
      }
      
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/ai/personas'] });
      toast.success('Persona deleted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to delete persona: ${error.message}`);
    },
  });
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      systemPrompt: '',
      model: 'openai/gpt-4o',
      provider: 'openai',
      description: '',
      avatarUrl: '',
    });
    setIsCreating(false);
    setIsEditing(null);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.systemPrompt) {
      toast.error('Name and system prompt are required');
      return;
    }
    
    if (isEditing) {
      updatePersona.mutate({ id: isEditing, data: formData });
    } else {
      createPersona.mutate(formData);
    }
  };
  
  // Edit persona
  const handleEdit = (persona: AIPersona) => {
    const personaId = persona.name.replace(/\s+/g, '-').toLowerCase();
    setIsEditing(personaId);
    setFormData({
      name: persona.name,
      systemPrompt: persona.systemPrompt,
      model: persona.model,
      provider: persona.provider,
      description: persona.description,
      avatarUrl: persona.avatarUrl,
    });
    setIsCreating(true);
  };
  
  // Delete persona
  const handleDelete = (personaId: string) => {
    if (confirm('Are you sure you want to delete this persona?')) {
      deletePersona.mutate(personaId);
    }
  };
  
  // Duplicate persona
  const handleDuplicate = (persona: AIPersona) => {
    setFormData({
      name: `${persona.name} (Copy)`,
      systemPrompt: persona.systemPrompt,
      model: persona.model,
      provider: persona.provider,
      description: persona.description,
      avatarUrl: persona.avatarUrl,
    });
    setIsCreating(true);
  };
  
  const renderPersonaCard = (persona: AIPersona) => {
    const personaId = persona.name.replace(/\s+/g, '-').toLowerCase();
    const initials = persona.name.split(' ').map(n => n[0]).join('').toUpperCase();
    
    return (
      <Card key={personaId} className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <Avatar className="h-10 w-10">
              <AvatarImage src={persona.avatarUrl} alt={persona.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex space-x-1">
              {persona.isCustom && (
                <>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(persona)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(personaId)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon" onClick={() => handleDuplicate(persona)}>
                <CopyPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardTitle>{persona.name}</CardTitle>
          <div className="flex flex-wrap gap-1">
            {persona.model && (
              <Badge variant="outline" className="text-xs">
                {persona.model.split('/').pop()}
              </Badge>
            )}
            {persona.provider && (
              <Badge variant="outline" className="text-xs">
                {persona.provider}
              </Badge>
            )}
            {persona.isCustom && (
              <Badge className="bg-primary/20 text-primary text-xs">Custom</Badge>
            )}
          </div>
          <CardDescription>{persona.description || 'No description provided'}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <div className="text-sm text-card-foreground/60">System Prompt:</div>
          <div className="mt-1 text-sm max-h-40 overflow-y-auto bg-card-foreground/5 p-2 rounded-md">
            {persona.systemPrompt.substring(0, 150)}
            {persona.systemPrompt.length > 150 && '...'}
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Link href={`/chat-fullscreen/${personaId}`}>
            <Button className="w-full" variant="outline">
              <MessageSquare className="mr-2 h-4 w-4" />
              Chat with {persona.name}
            </Button>
          </Link>
        </CardFooter>
      </Card>
    );
  };
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Personas</h1>
          <p className="text-muted-foreground">Create and manage AI personas with custom personalities</p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Persona
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center my-16">
          <Spinner size="lg" />
        </div>
      ) : (
        <Tabs defaultValue="all">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Personas</TabsTrigger>
            <TabsTrigger value="custom">Custom</TabsTrigger>
            <TabsTrigger value="built-in">Built-in</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personas?.map(renderPersonaCard)}
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personas?.filter(p => p.isCustom).map(renderPersonaCard)}
              {personas?.filter(p => p.isCustom).length === 0 && (
                <div className="col-span-3 text-center py-16">
                  <p className="text-muted-foreground">No custom personas yet</p>
                  <Button onClick={() => setIsCreating(true)} className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Persona
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="built-in" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {personas?.filter(p => !p.isCustom).map(renderPersonaCard)}
            </div>
          </TabsContent>
        </Tabs>
      )}
      
      <Dialog open={isCreating} onOpenChange={(open) => {
        if (!open) resetForm();
        setIsCreating(open);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Persona' : 'Create New Persona'}</DialogTitle>
            <DialogDescription>
              Create a custom AI persona with a unique personality and behavior
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="text-sm font-medium">Name</label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Strategy Expert"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="text-sm font-medium">Description</label>
                  <Input
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    placeholder="e.g., Helps with strategic planning and decision making"
                  />
                </div>
                
                <div>
                  <label htmlFor="avatarUrl" className="text-sm font-medium">Avatar URL</label>
                  <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    value={formData.avatarUrl || ''}
                    onChange={handleInputChange}
                    placeholder="https://example.com/avatar.png"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="model" className="text-sm font-medium">Model</label>
                    <Select
                      value={formData.model}
                      onValueChange={(value) => handleSelectChange('model', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Model" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableModels.map(model => (
                          <SelectItem key={model.id} value={model.id}>
                            {model.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label htmlFor="provider" className="text-sm font-medium">Provider</label>
                    <Select
                      value={formData.provider}
                      onValueChange={(value) => handleSelectChange('provider', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Provider" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="openrouter">OpenRouter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div>
                <label htmlFor="systemPrompt" className="text-sm font-medium">System Prompt</label>
                <Textarea
                  id="systemPrompt"
                  name="systemPrompt"
                  value={formData.systemPrompt}
                  onChange={handleInputChange}
                  placeholder="You are a helpful assistant..."
                  className="h-[235px] resize-none"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="submit" disabled={createPersona.isPending || updatePersona.isPending}>
                {(createPersona.isPending || updatePersona.isPending) && <Spinner className="mr-2" size="sm" />}
                {isEditing ? 'Update Persona' : 'Create Persona'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AIPersonasPage;
