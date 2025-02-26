
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { pageVariants, containerVariants, itemVariants } from "@/lib/animations";
import { Resource, BlogPost, MusicSample } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// Remove non-existent charts import
// import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { 
  Download, Users, DollarSign, TrendingUp, Filter,
  Calendar, ChevronDown, FileText, Share2, Tag, 
  Music, Edit, ArrowUpRight, PlusCircle, GripVertical,
  Image, PenTool, Video, BarChart3, Upload, Layers
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import MusicUploader from "@/components/music/MusicUploader";
import BlogContentUploader from "@/components/blog/BlogContentUploader";

const Dashboard = () => {
  const [dateRange, setDateRange] = useState("7d");
  const [activeTab, setActiveTab] = useState("overview");
  
  // Fetch resources for analytics
  const { data: resources } = useQuery<Resource[]>({
    queryKey: ['/api/resources'],
  });
  
  // Mock analytics data - this would come from your API in a real implementation
  const analyticsData = {
    totalDownloads: resources?.reduce((sum, resource) => sum + (resource.downloads || 0), 0) || 0,
    totalSales: 2450,
    totalRevenue: 1275.50,
    affiliateRevenue: 320.25,
    downloads: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [65, 92, 78, 85, 110, 142, 121]
    },
    sales: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [3, 5, 2, 4, 8, 10, 7]
    },
    revenue: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      data: [45, 75, 30, 60, 120, 150, 105]
    },
    resourcePerformance: resources?.slice(0, 5).map(resource => ({
      name: resource.title,
      downloads: resource.downloads || Math.floor(Math.random() * 100),
      sales: resource.isPremium ? Math.floor(Math.random() * 20) : 0,
      revenue: resource.isPremium ? (parseFloat(resource.price || "0") * Math.floor(Math.random() * 20)).toFixed(2) : "0"
    })) || []
  };
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-clash font-bold mb-2">Resource Analytics</h1>
            <p className="text-muted-foreground">
              Track downloads, sales, and revenue from your resources
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center space-x-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Last {dateRange === "7d" ? "7 days" : dateRange === "30d" ? "30 days" : "12 months"}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
            
            <Button>Export Report</Button>
          </div>
        </div>
        
        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Downloads</p>
                  <h3 className="text-2xl font-bold">{analyticsData.totalDownloads}</h3>
                  <p className="text-xs text-green-500 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +12.5% from last period
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <Download className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Sales</p>
                  <h3 className="text-2xl font-bold">{analyticsData.totalSales}</h3>
                  <p className="text-xs text-green-500 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +8.3% from last period
                  </p>
                </div>
                <div className="h-12 w-12 bg-secondary/10 rounded-full flex items-center justify-center text-secondary">
                  <Tag className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Total Revenue</p>
                  <h3 className="text-2xl font-bold">${analyticsData.totalRevenue.toFixed(2)}</h3>
                  <p className="text-xs text-green-500 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +15.2% from last period
                  </p>
                </div>
                <div className="h-12 w-12 bg-accent/10 rounded-full flex items-center justify-center text-accent">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Affiliate Revenue</p>
                  <h3 className="text-2xl font-bold">${analyticsData.affiliateRevenue.toFixed(2)}</h3>
                  <p className="text-xs text-green-500 mt-1 flex items-center">
                    <TrendingUp className="h-3 w-3 mr-1" /> +5.7% from last period
                  </p>
                </div>
                <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                  <Share2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs for different views */}
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:flex lg:flex-wrap">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="downloads">Downloads</TabsTrigger>
            <TabsTrigger value="sales">Sales</TabsTrigger>
            <TabsTrigger value="affiliate">Affiliate</TabsTrigger>
            <TabsTrigger value="content" className="hidden md:flex">Content Creation</TabsTrigger>
            <TabsTrigger value="music" className="hidden md:flex">Music Studio</TabsTrigger>
            <TabsTrigger value="blog" className="hidden md:flex">Blog Editor</TabsTrigger>
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Performance Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {/* This would be a real chart component in a full implementation */}
                    <div className="bg-muted h-full rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Performance Chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Resource Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    {/* This would be a real chart component in a full implementation */}
                    <div className="bg-muted h-full rounded-md flex items-center justify-center">
                      <p className="text-muted-foreground">Distribution Chart</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Top Performing Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left font-medium p-3">Resource</th>
                        <th className="text-left font-medium p-3">Downloads</th>
                        <th className="text-left font-medium p-3">Sales</th>
                        <th className="text-left font-medium p-3">Revenue</th>
                        <th className="text-left font-medium p-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyticsData.resourcePerformance.map((resource, index) => (
                        <tr key={index} className="border-b hover:bg-muted/50">
                          <td className="p-3 flex items-center">
                            <div className="bg-secondary/10 p-2 rounded-md mr-3">
                              <FileText className="h-5 w-5 text-secondary" />
                            </div>
                            <span className="font-medium">{resource.name}</span>
                          </td>
                          <td className="p-3">{resource.downloads}</td>
                          <td className="p-3">{resource.sales}</td>
                          <td className="p-3">${resource.revenue}</td>
                          <td className="p-3">
                            <Button variant="ghost" size="sm">View Details</Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Other tabs would have similar content but focused on their specific data */}
          <TabsContent value="downloads" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Download Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* This would be a real chart component in a full implementation */}
                  <div className="bg-muted h-full rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Downloads Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="sales" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Sales Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* This would be a real chart component in a full implementation */}
                  <div className="bg-muted h-full rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Sales Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="affiliate" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Affiliate Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {/* This would be a real chart component in a full implementation */}
                  <div className="bg-muted h-full rounded-md flex items-center justify-center">
                    <p className="text-muted-foreground">Affiliate Revenue Chart</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Content Creation Central Hub */}
          <TabsContent value="content" className="mt-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <div>
                  <h2 className="text-2xl font-clash font-bold mb-1">Content Creation Hub</h2>
                  <p className="text-muted-foreground">Manage all your content in one place</p>
                </div>
                <div className="mt-4 md:mt-0 space-x-2">
                  <Button onClick={() => setActiveTab("blog")} className="bg-[#171717] text-white hover:bg-[#171717]/90">
                    <Edit className="mr-2 h-4 w-4" /> Create Blog Post
                  </Button>
                  <Button onClick={() => setActiveTab("music")} className="bg-[#00C2FF] text-white hover:bg-[#00C2FF]/90">
                    <Music className="mr-2 h-4 w-4" /> Create Music
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Recent Blog Posts</CardTitle>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                      <PenTool className="h-6 w-6 text-[#00C2FF]" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Building an AI Center of Excellence</p>
                        <p className="text-sm text-muted-foreground">Feb 24, 2025 • 5 mins read</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto flex shrink-0 items-center gap-1">
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                      <PenTool className="h-6 w-6 text-[#FF3366]" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">AI Implementation Guide for Enterprises</p>
                        <p className="text-sm text-muted-foreground">Feb 20, 2025 • 8 mins read</p>
                      </div>
                      <Button variant="ghost" size="sm" className="ml-auto flex shrink-0 items-center gap-1">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">AI Music Samples</CardTitle>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PlusCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                      <Music className="h-6 w-6 text-[#00C2FF]" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Corporate Innovation</p>
                        <p className="text-sm text-muted-foreground">Ambient • 3:24</p>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center space-x-4 rounded-md border p-4">
                      <Music className="h-6 w-6 text-[#FF3366]" />
                      <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">Tech Future</p>
                        <p className="text-sm text-muted-foreground">Electronic • 2:45</p>
                      </div>
                      <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-medium">Recent Analytics</CardTitle>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">Blog Views</p>
                          <div className="text-sm font-medium">1,293</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#171717] to-[#00C2FF]" style={{ width: "75%" }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">Music Plays</p>
                          <div className="text-sm font-medium">845</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#00C2FF] to-[#FF3366]" style={{ width: "63%" }} />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium leading-none">Resource Downloads</p>
                          <div className="text-sm font-medium">327</div>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className="h-full rounded-full bg-gradient-to-r from-[#FF3366] to-[#171717]" style={{ width: "45%" }} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Music Studio Tab */}
          <TabsContent value="music" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>AI Music Studio</CardTitle>
                    <CardDescription>
                      Upload and manage your AI-generated music or use Suno links to import tracks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <MusicUploader />
                  </CardContent>
                </Card>
              </div>
              
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Suno AI Integration</CardTitle>
                    <CardDescription>
                      Paste a Suno link to directly import your AI-generated music
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="sunoLink" className="block text-sm font-medium mb-1">
                          Suno Track Link
                        </label>
                        <div className="flex gap-2">
                          <Input 
                            id="sunoLink"
                            placeholder="https://suno.ai/song/..."
                            className="flex-1"
                          />
                          <Button className="bg-gradient-to-r from-[#00C2FF] to-[#FF3366] text-white hover:opacity-90">
                            <ArrowUpRight className="mr-2 h-4 w-4" />
                            Import
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Alternatively, you can upload MP3 files directly from your computer using the uploader.
                        </p>
                        
                        <div className="p-4 border border-dashed rounded-lg">
                          <div className="flex items-center">
                            <div className="bg-[#00C2FF]/10 p-2 rounded-full mr-3">
                              <Layers className="h-5 w-5 text-[#00C2FF]" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">Your music is stored securely</p>
                              <p className="text-xs text-muted-foreground">
                                Files are stored with high-quality compression and streaming capabilities
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Music Library Management</CardTitle>
                    <CardDescription>
                      Organize and categorize your AI music collection
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex items-center space-x-3 border rounded-lg p-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-md bg-gradient-to-br from-[#00C2FF] to-[#FF3366] flex items-center justify-center">
                              <Music className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Ambient</p>
                            <p className="text-xs text-muted-foreground">3 tracks</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 border rounded-lg p-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-md bg-gradient-to-br from-[#171717] to-[#00C2FF] flex items-center justify-center">
                              <Music className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Electronic</p>
                            <p className="text-xs text-muted-foreground">2 tracks</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3 border rounded-lg p-3">
                          <div className="flex-shrink-0">
                            <div className="h-10 w-10 rounded-md bg-gradient-to-br from-[#FF3366] to-[#171717] flex items-center justify-center">
                              <Music className="h-5 w-5 text-white" />
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium">Corporate</p>
                            <p className="text-xs text-muted-foreground">4 tracks</p>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="flex items-center justify-center h-full">
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Category
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* Blog Editor Tab */}
          <TabsContent value="blog" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>New Blog Post</CardTitle>
                    <CardDescription>
                      Create a new blog post with rich multimedia content
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="postTitle" className="block text-sm font-medium mb-1">
                          Post Title
                        </label>
                        <Input 
                          id="postTitle"
                          placeholder="Enter a compelling title..."
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="postExcerpt" className="block text-sm font-medium mb-1">
                          Excerpt
                        </label>
                        <Textarea
                          id="postExcerpt"
                          placeholder="Write a brief summary of your post..."
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="postCategory" className="block text-sm font-medium mb-1">
                          Category
                        </label>
                        <div className="flex gap-2 flex-wrap">
                          {["AI Strategy", "Implementation", "Case Studies", "Technical", "Thought Leadership"].map((category) => (
                            <Button 
                              key={category}
                              variant="outline" 
                              className="mb-2 text-xs"
                              size="sm"
                            >
                              {category}
                            </Button>
                          ))}
                          <Button variant="outline" size="sm" className="mb-2 text-xs">
                            <PlusCircle className="h-3 w-3 mr-1" /> New
                          </Button>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="postContent" className="block text-sm font-medium mb-1">
                          Content
                        </label>
                        <Textarea
                          id="postContent"
                          placeholder="Write your post content or use markdown..."
                          rows={10}
                          className="font-mono text-sm"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Save Draft</Button>
                    <Button className="bg-gradient-to-r from-[#171717] to-[#00C2FF] text-white hover:opacity-90">
                      Publish Post
                    </Button>
                  </CardFooter>
                </Card>
              </div>
              
              <div>
                <BlogContentUploader />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Dashboard;
