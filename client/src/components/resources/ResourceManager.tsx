
import { useState } from "react";
import { Resource } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, FileType, Plus, Check, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import FileUploader from "./FileUploader";

interface ResourceManagerProps {
  isAdmin: boolean;
}

const ResourceManager = ({ isAdmin }: ResourceManagerProps) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [resourceData, setResourceData] = useState({
    title: "",
    description: "",
    type: "pdf",
    icon: "file-pdf",
    link: "",
    isPremium: false,
    affiliateCode: "",
    price: "0",
  });

  const createResourceMutation = useMutation({
    mutationFn: async (newResource: any) => {
      const response = await fetch('/api/resources', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newResource),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create resource');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/resources'] });
      setShowForm(false);
      setResourceData({
        title: "",
        description: "",
        type: "pdf",
        icon: "file-pdf",
        link: "",
        isPremium: false,
        affiliateCode: "",
        price: "0",
      });
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setResourceData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setResourceData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setResourceData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createResourceMutation.mutate(resourceData);
  };

  if (!isAdmin) return null;

  return (
    <div className="mb-12">
      {!showForm ? (
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2"
        >
          <Plus size={16} /> Add New Resource
        </Button>
      ) : (
        <Card className="border border-border/50">
          <CardHeader>
            <CardTitle>Add New Resource</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <Input 
                  name="title"
                  value={resourceData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <Textarea 
                  name="description"
                  value={resourceData.description}
                  onChange={handleInputChange}
                  required
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Type</label>
                  <Select 
                    value={resourceData.type}
                    onValueChange={(value) => handleSelectChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="template">Template</SelectItem>
                      <SelectItem value="checklist">Checklist</SelectItem>
                      <SelectItem value="course">Course</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <Select 
                    value={resourceData.icon}
                    onValueChange={(value) => handleSelectChange("icon", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select icon" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="file-pdf">PDF</SelectItem>
                      <SelectItem value="play-circle">Video</SelectItem>
                      <SelectItem value="table">Template</SelectItem>
                      <SelectItem value="clipboard-list">Checklist</SelectItem>
                      <SelectItem value="book-open">Course</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Resource Link</label>
                <div className="grid grid-cols-1 gap-4">
                  <Input 
                    name="link"
                    value={resourceData.link}
                    onChange={handleInputChange}
                    required={!resourceData.link.startsWith("/resources/")}
                    placeholder="/resources/filename.pdf or https://..."
                  />
                  <div className="- or mt-2 mb-2 text-center text-sm text-muted-foreground">or</div>
                  <FileUploader 
                    onFileUploaded={(fileUrl) => {
                      setResourceData(prev => ({ ...prev, link: fileUrl }));
                    }}
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPremium"
                  name="isPremium"
                  checked={resourceData.isPremium}
                  onChange={handleCheckboxChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="isPremium" className="text-sm font-medium">
                  Premium Resource (Requires Payment)
                </label>
              </div>
              
              {resourceData.isPremium && (
                <div>
                  <label className="block text-sm font-medium mb-1">Price (USD)</label>
                  <Input 
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={resourceData.price}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium mb-1">Affiliate Code (Optional)</label>
                <Input 
                  name="affiliateCode"
                  value={resourceData.affiliateCode}
                  onChange={handleInputChange}
                  placeholder="For tracking affiliate revenue"
                />
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowForm(false)}
              className="flex items-center gap-1"
            >
              <X size={16} /> Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              className="flex items-center gap-1"
              disabled={createResourceMutation.isPending}
            >
              {createResourceMutation.isPending ? (
                <span>Saving...</span>
              ) : (
                <>
                  <Check size={16} /> Save Resource
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ResourceManager;
