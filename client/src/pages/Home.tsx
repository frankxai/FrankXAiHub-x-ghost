import { motion } from "framer-motion";
import { pageVariants } from "@/lib/animations";
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import CallToAction from "@/components/home/CallToAction";
import { useQuery } from "@tanstack/react-query";
import { BlogPost } from "@shared/schema";
import BlogCard from "@/components/blog/BlogCard";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Home = () => {
  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ['/api/blog-posts'],
  });

  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <HeroSection />
      <FeaturesSection />
      
      {/* Blog Section */}
      <section id="blog" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-clash font-bold mb-2">Thought Leadership</h2>
              <p className="text-lg text-overlay max-w-2xl">Expert insights on enterprise AI transformation, implementation strategies, and emerging technologies.</p>
            </div>
            <Link href="/blog">
              <Button variant="outline" className="mt-4 md:mt-0">
                View All Articles
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogPosts && blogPosts.slice(0, 3).map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Resources Section */}
      <section id="resources" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-clash font-bold mb-4">AI Center of Excellence</h2>
            <p className="text-lg text-overlay">Access frameworks, tools, and resources to build your organization's AI capabilities.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Resource cards will be loaded from API on dedicated Resources page */}
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="font-clash font-bold text-lg mb-2">AI Governance Framework</h3>
              <p className="text-sm text-overlay mb-4">Comprehensive guide to establishing ethical AI governance principles and practices.</p>
              <a href="#" className="text-sm font-medium text-primary flex items-center">
                Download PDF 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-clash font-bold text-lg mb-2">AI Strategy Webinar</h3>
              <p className="text-sm text-overlay mb-4">Expert panel discussion on developing enterprise AI strategy and roadmaps.</p>
              <a href="#" className="text-sm font-medium text-primary flex items-center">
                Watch Now 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-clash font-bold text-lg mb-2">AI Business Case Template</h3>
              <p className="text-sm text-overlay mb-4">Excel template to calculate ROI and build business cases for AI initiatives.</p>
              <a href="#" className="text-sm font-medium text-primary flex items-center">
                Download Template 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-clash font-bold text-lg mb-2">AI Readiness Checklist</h3>
              <p className="text-sm text-overlay mb-4">Self-assessment tool to evaluate your organization's readiness for AI adoption.</p>
              <a href="#" className="text-sm font-medium text-primary flex items-center">
                Access Checklist 
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/resources">
              <Button variant="outline" className="inline-flex items-center">
                View All Resources
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      <CallToAction />
    </motion.div>
  );
};

export default Home;
