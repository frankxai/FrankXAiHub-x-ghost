import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { pageVariants, containerVariants, itemVariants } from "@/lib/animations";
import { Resource } from "@shared/schema";
import ResourceCard from "@/components/resources/ResourceCard";
import PremiumResourceCard from "@/components/resources/PremiumResourceCard";
import ResourceManager from "@/components/resources/ResourceManager";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Crown } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState("all");
  const [isPremiumFilter, setIsPremiumFilter] = useState("all");
  const [isAdmin, setIsAdmin] = useState(true); // Set this based on user role in a real app
  
  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });
  
  // Get unique resource types
  const resourceTypes = resources 
    ? ["all", ...new Set(resources.map(resource => resource.type))]
    : ["all"];
  
  // Filter resources by search term, type, and premium status
  const filteredResources = resources?.filter(resource => {
    const matchesSearch = searchTerm === "" || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesType = activeType === "all" || resource.type === activeType;
    
    const matchesPremium = 
      isPremiumFilter === "all" || 
      (isPremiumFilter === "premium" && resource.isPremium) ||
      (isPremiumFilter === "free" && !resource.isPremium);
      
    return matchesSearch && matchesType && matchesPremium;
  });

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-clash font-bold mb-4">AI Center of Excellence</h1>
          <p className="text-lg text-overlay">
            Access frameworks, tools, and resources to build your organization's AI capabilities.
          </p>
        </div>
        
        {/* Admin Resource Manager */}
        {isAdmin && (
          <div className="mb-10">
            <ResourceManager isAdmin={isAdmin} />
          </div>
        )}
        
        {/* Search and filter */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search resources..."
              className="pl-10 py-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Tabs defaultValue="all" onValueChange={setActiveType} className="flex-1">
              <TabsList className="flex overflow-x-auto pb-2 space-x-2">
                {resourceTypes.map((type) => (
                  <TabsTrigger
                    key={type}
                    value={type}
                    className="capitalize"
                  >
                    {type === "all" ? "All Resources" : type}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            
            <Tabs defaultValue="all" onValueChange={setIsPremiumFilter}>
              <TabsList className="flex space-x-2">
                <TabsTrigger value="all">
                  All
                </TabsTrigger>
                <TabsTrigger value="free">
                  Free
                </TabsTrigger>
                <TabsTrigger value="premium" className="flex items-center">
                  <Crown className="h-3 w-3 mr-1" /> Premium
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          </Tabs>
        </div>
        
        {/* Featured resources section */}
        <section className="mb-16">
          <h2 className="text-2xl font-clash font-bold mb-6">Featured Resources</h2>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div 
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
              variants={itemVariants}
            >
              <div className="mb-4 text-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-clash font-bold mb-2">Complete AI Transformation Playbook</h3>
              <p className="text-overlay mb-6">A comprehensive guide to implementing AI across your organization, from strategy to execution.</p>
              <Button>
                Download Playbook
              </Button>
            </motion.div>
            
            <motion.div 
              className="bg-gray-50 rounded-2xl p-8 border border-gray-100"
              variants={itemVariants}
            >
              <div className="mb-4 text-accent">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-2xl font-clash font-bold mb-2">AI Center of Excellence Webinar Series</h3>
              <p className="text-overlay mb-6">Join our expert-led webinars on building and scaling an AI Center of Excellence in your organization.</p>
              <Button>
                Register Now
              </Button>
            </motion.div>
          </motion.div>
        </section>
        
        {/* Resources grid */}
        <section>
          <h2 className="text-2xl font-clash font-bold mb-6">All Resources</h2>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-48 animate-pulse"></div>
              ))}
            </div>
          ) : filteredResources && filteredResources.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="initial"
              animate="animate"
            >
              {filteredResources.map((resource) => (
                <motion.div key={resource.id} variants={itemVariants}>
                  {resource.isPremium ? (
                    <PremiumResourceCard resource={resource} />
                  ) : (
                    <ResourceCard resource={resource} />
                  )}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-medium mb-2">No resources found</h3>
              <p className="text-overlay mb-6">Try adjusting your search or filters</p>
              <Button onClick={() => {
                setSearchTerm("");
                setActiveType("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </section>
        
        {/* CTA Section */}
        <section className="mt-20 bg-gray-900 text-white rounded-2xl p-8 md:p-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-clash font-bold mb-4">Need Custom AI Resources?</h2>
              <p className="text-gray-300 mb-6">
                Our team of AI experts can develop customized frameworks, training programs, and implementation guides specific to your organization's needs.
              </p>
              <Button className="bg-secondary hover:bg-secondary/90 text-white">
                Request Custom Resources
              </Button>
            </div>
            <div className="hidden md:block">
              <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full max-w-md mx-auto opacity-20">
                <path fill="#00C2FF" d="M45.7,-76.3C53.9,-67.3,51.5,-45.7,55.1,-29.9C58.7,-14,68.4,-4,72.2,8.9C76,21.7,73.9,37.4,65.1,47.4C56.3,57.5,40.9,61.8,27.4,65C13.9,68.1,2.3,70.1,-12.4,72.5C-27.1,74.9,-44.9,77.8,-57.8,70.9C-70.6,64.1,-78.5,47.5,-81.9,30.9C-85.3,14.4,-84.1,-2.1,-75.9,-13.7C-67.7,-25.3,-52.4,-32,-40.9,-42.7C-29.4,-53.3,-21.6,-67.9,-9.8,-74.2C2,-80.5,17.8,-78.6,28.6,-73C39.4,-67.5,37.5,-85.3,45.7,-76.3Z" transform="translate(100 100)" />
              </svg>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default Resources;
