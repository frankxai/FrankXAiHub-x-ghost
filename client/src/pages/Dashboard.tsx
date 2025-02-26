
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { pageVariants, containerVariants, itemVariants } from "@/lib/animations";
import { Resource, BlogPost, MusicSample } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, LineChart, PieChart } from "@/components/ui/charts";
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
        </Tabs>
      </div>
    </motion.div>
  );
};

export default Dashboard;
