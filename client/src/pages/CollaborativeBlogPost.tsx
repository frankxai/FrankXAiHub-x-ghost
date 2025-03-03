import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { pageVariants } from "@/lib/animations";
import { BlogPost as BlogPostType } from "@shared/schema";
import ProgressTracker from "@/components/blog/ProgressTracker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronUp, 
  ChevronLeft, 
  Share2, 
  Calendar, 
  Clock, 
  ThumbsUp, 
  Copy, 
  Twitter, 
  Linkedin 
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import { getPersonaById } from "@/lib/ai-personas";
import CollaborativeBlogContent from "@/components/blog/CollaborativeBlogContent";
import InteractiveBlogQuiz, { QuizAnswers } from "@/components/blog/InteractiveBlogQuiz";

import { QuizQuestion, QuizQuestionType } from '@/components/blog/InteractiveBlogQuiz';

const aiCoeQuizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    type: "multiple-choice" as QuizQuestionType,
    question: "What is your organization's current stage in AI adoption?",
    options: [
      "Exploring AI opportunities",
      "Piloting first AI projects",
      "Scaling successful AI initiatives",
      "Mature AI program with multiple deployed solutions",
      "Advanced organization-wide AI transformation"
    ],
    isRequired: true
  },
  {
    id: "q2",
    type: "checkbox" as QuizQuestionType,
    question: "Which aspects of an AI Center of Excellence do you find most valuable? (Select all that apply)",
    options: [
      "Standardized AI governance",
      "Centralized AI expertise",
      "Accelerated project delivery",
      "Knowledge sharing across teams",
      "Risk mitigation strategies",
      "Technology stack standardization"
    ]
  },
  {
    id: "q3",
    type: "rating" as QuizQuestionType,
    question: "How important is establishing clear AI governance for your organization?",
    isRequired: true
  },
  {
    id: "q4",
    type: "text" as QuizQuestionType,
    question: "What is your biggest challenge in implementing an AI Center of Excellence?",
    isRequired: true
  },
  {
    id: "q5",
    type: "multiple-choice" as QuizQuestionType,
    question: "How would you prefer to organize your AI Center of Excellence?",
    options: [
      "Centralized model (single team)",
      "Hub and spoke model (central team + distributed experts)",
      "Community of practice (distributed experts)",
      "Hybrid approach"
    ]
  }
];

const CollaborativeBlogPost = () => {
  const { id } = useParams();
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const postId = id ? parseInt(id) : 0;
  
  const [readingProgress, setReadingProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Query for current blog post
  const { data: post, isLoading, error } = useQuery<BlogPostType>({
    queryKey: [`/api/blog-posts/${postId}`],
  });
  
  // Query for all blog posts (for related posts)
  const { data: allPosts } = useQuery<BlogPostType[]>({
    queryKey: ['/api/blog-posts'],
    enabled: !isLoading && !!post,
  });
  
  // Handle quiz completion
  const handleQuizComplete = (answers: QuizAnswers) => {
    console.log("Quiz answers:", answers);
    // In a real app, you would send this data to a backend
  };
  
  // Check for scroll position to show/hide back to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
      
      // Calculate reading progress
      if (contentRef.current) {
        const contentHeight = contentRef.current.offsetHeight;
        const currentPosition = window.scrollY - contentRef.current.offsetTop + window.innerHeight / 2;
        const progress = Math.min(100, Math.max(0, Math.floor((currentPosition / contentHeight) * 100)));
        setReadingProgress(progress);
        
        // Save reading progress to localStorage
        if (post && progress > 0) {
          localStorage.setItem(`reading-progress-${post.id}`, progress.toString());
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [post]);
  
  // Update document title for SEO
  useEffect(() => {
    if (post) {
      document.title = `${post.title} - FrankX.AI Center of Excellence`;
    }
    
    return () => {
      document.title = 'FrankX.AI Center of Excellence';
    };
  }, [post]);
  
  // Handle sharing functions
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post?.title,
          text: post?.excerpt,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      copyToClipboard(window.location.href);
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: 'Link copied to clipboard',
        description: 'You can now share it with anyone',
      });
    });
  };
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };
  
  if (isLoading) {
    return (
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-4 w-3/4"></div>
            <div className="h-6 bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-8 w-1/2"></div>
            <div className="aspect-video bg-gray-200 dark:bg-gray-800 rounded animate-pulse mb-8"></div>
            <div className="space-y-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-full"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !post) {
    return (
      <div className="pt-28 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/blog")}>Back to Blog</Button>
        </div>
      </div>
    );
  }
  
  // Sample collaborative content sections - in a real app, these would come from the database
  const blogSections = [
    {
      personaId: "default",
      content: `# Building an Effective AI Center of Excellence: A Collaborative Guide

Welcome to this comprehensive guide on establishing and operating an AI Center of Excellence (CoE) for your organization. This collaborative article brings together perspectives from different domains to provide you with a holistic understanding of what it takes to build a successful AI CoE.

As organizations increasingly adopt AI technologies, the need for structured governance, standardized processes, and centralized expertise becomes critical. An AI Center of Excellence addresses these needs by creating a dedicated function that drives AI strategy, implementation, and best practices across the organization.

Let me introduce you to this collaborative guide, where each of my specialized personas will contribute their unique expertise to help you build a comprehensive AI Center of Excellence.`
    },
    {
      personaId: "strategist",
      content: `## Strategic Foundations: Defining Your AI Center of Excellence

The foundation of any successful AI CoE begins with strategic alignment to organizational goals. As we explore the strategic aspects, we'll focus on how to position your AI CoE for maximum impact.

### Defining the CoE Mission and Vision

Your AI CoE should have a clear mission that aligns with broader organizational objectives. Consider these elements:

- **Purpose Statement**: Define why the CoE exists (e.g., "To accelerate AI adoption that drives measurable business value")
- **Vision**: Articulate what success looks like in 3-5 years
- **Value Proposition**: Clarify how the CoE will benefit different stakeholders

### Selecting the Right Operating Model

The organizational structure of your AI CoE will significantly impact its effectiveness. Consider these models:

1. **Centralized**: A single team responsible for all AI initiatives
   * Pros: Consistent standards, concentrated expertise
   * Cons: Potential bottlenecks, distance from business units

2. **Hub-and-Spoke**: Central coordinating team with distributed experts
   * Pros: Balanced oversight and business proximity
   * Cons: Complex matrix management

3. **Federated**: Distributed expertise with central governance
   * Pros: Close to business needs, scalable
   * Cons: Potential inconsistency, duplication

4. **Community of Practice**: Network of practitioners with shared standards
   * Pros: Organic knowledge sharing, minimal structural change
   * Cons: Limited formal authority

Most organizations benefit from a hybrid approach that evolves over time, often starting more centralized and becoming more distributed as AI maturity increases.

### Defining Success Metrics

Establishing clear KPIs for your AI CoE is crucial for demonstrating value:

- **Activity Metrics**: Number of projects, training sessions, consultations
- **Output Metrics**: Models deployed, use cases implemented
- **Business Impact**: Revenue generated, costs reduced, customer satisfaction
- **Capability Building**: Staff trained, AI literacy improvement

Remember, a successful AI CoE strategy balances immediate wins with long-term capability building.`,
      transition: "Shifting from strategy to implementation architecture..."
    },
    {
      personaId: "architect",
      content: `## Technical Architecture: Building the AI Platform

With the strategic foundation in place, we need to establish the technical architecture that will support your AI Center of Excellence. This infrastructure is critical for standardization, scalability, and governance.

### Core Technical Components

An effective AI platform should include:

\`\`\`
AI PLATFORM ARCHITECTURE
┌────────────────────────────────────────────────────────┐
│ AI GOVERNANCE LAYER                                    │
│ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │
│ │ Model      │ │ Data       │ │ Security &         │  │
│ │ Registry   │ │ Governance │ │ Access Control     │  │
│ └────────────┘ └────────────┘ └────────────────────┘  │
├────────────────────────────────────────────────────────┤
│ AI DEVELOPMENT & DEPLOYMENT                            │
│ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │
│ │ Model      │ │ CI/CD      │ │ Monitoring &       │  │
│ │ Development│ │ Pipelines  │ │ Observability      │  │
│ └────────────┘ └────────────┘ └────────────────────┘  │
├────────────────────────────────────────────────────────┤
│ DATA SERVICES                                          │
│ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │
│ │ Data       │ │ Feature    │ │ Data               │  │
│ │ Processing │ │ Store      │ │ Warehousing        │  │
│ └────────────┘ └────────────┘ └────────────────────┘  │
├────────────────────────────────────────────────────────┤
│ INFRASTRUCTURE                                         │
│ ┌────────────┐ ┌────────────┐ ┌────────────────────┐  │
│ │ Compute    │ │ Storage    │ │ Networking         │  │
│ │ Resources  │ │ Solutions  │ │                    │  │
│ └────────────┘ └────────────┘ └────────────────────┘  │
└────────────────────────────────────────────────────────┘
\`\`\`

### Development Environment Standardization

Standardizing development environments across your organization ensures consistency and accelerates implementation:

1. **Common Development Tools**:
   - Establish standard notebooks, IDEs, and development containers
   - Create template repositories with best practices built-in

2. **Model Development Lifecycle**:
   - Define stages: Experimentation → Development → Testing → Deployment → Monitoring
   - Implement automated testing for model quality and performance

3. **Model Registry and Versioning**:
   - Maintain centralized registry of all models with metadata
   - Implement versioning for reproducibility and rollback capability

### MLOps Implementation

MLOps practices are essential for operationalizing AI at scale:

\`\`\`python
# Example MLOps pipeline for model deployment
def deploy_model(model_id, environment):
    """
    Streamlined deployment process that implements governance checks
    """
    # 1. Retrieve model from registry
    model = model_registry.get_model(model_id)
    
    # 2. Run governance checks
    governance_check = run_governance_checks(model)
    if not governance_check.passed:
        return governance_check.failed_reasons
    
    # 3. Package model for deployment
    package = package_model(model, environment)
    
    # 4. Deploy to target environment
    deployment = deploy_package(package, environment)
    
    # 5. Set up monitoring
    monitoring = setup_monitoring(deployment, 
                                 thresholds=model.monitoring_thresholds)
    
    return {
        "deployment_id": deployment.id,
        "status": deployment.status,
        "monitoring_dashboard": monitoring.dashboard_url
    }
\`\`\`

### Technology Selection Guidelines

Your CoE should provide guidance on technology selection based on:

- **Use Case Compatibility**: Matching tools to specific AI problems
- **Scalability Requirements**: Supporting growth from prototype to production
- **Integration Capabilities**: Working with existing enterprise systems
- **Total Cost of Ownership**: Including licensing, maintenance, and expertise

The technical architecture is the backbone that enables your AI CoE to standardize implementation while maintaining the flexibility to address diverse business needs.`,
      transition: "Looking beyond technology to the people dimension..."
    },
    {
      personaId: "coach",
      content: `## Building AI Capabilities: The People Dimension

The success of your AI Center of Excellence ultimately depends on people—their skills, behaviors, and ways of working. Let's explore how to build the human capabilities needed for AI excellence.

### Team Structure and Roles

A successful AI CoE requires diverse roles working together:

| Role | Core Responsibilities | Skills Required |
|------|----------------------|----------------|
| CoE Leader | Strategic direction, stakeholder management | Leadership, AI literacy, business acumen |
| Data Scientists | Model development, experimentation | Statistics, programming, domain knowledge |
| ML Engineers | Operationalization, platform development | Software engineering, DevOps, ML frameworks |
| Data Engineers | Data pipeline development, data quality | Data processing, infrastructure, ETL |
| Solution Architects | System design, integration | Enterprise architecture, technical design |
| Change Agents | Adoption, training, communication | Communication, training, change management |

### Building an AI-Ready Culture

Beyond specific roles, your organization needs a broader culture that embraces AI:

1. **Psychological Safety**
   - Create environments where teams can experiment without fear of failure
   - Celebrate learning, not just successes

2. **Cross-Functional Collaboration**
   - Break down silos between technical and business teams
   - Create shared understanding through collaborative workshops and projects

3. **Decision-Making Frameworks**
   - Establish guidelines for human-AI collaboration in decision processes
   - Define levels of automation and human oversight for different contexts

### Learning and Development Strategy

A comprehensive L&D approach should address different personas:

- **Executive Leaders**: Focus on strategic understanding and governance
- **Business Teams**: Emphasize use case identification and working with AI
- **Technical Teams**: Provide deep technical training and hands-on experience
- **General Staff**: Build AI literacy and understanding of implications

Consider multiple learning formats:

- **Formal Training**: Structured courses on technical and non-technical topics
- **Peer Learning**: Communities of practice, lunch-and-learns
- **Project-Based Learning**: Learning by doing with coaching support
- **External Resources**: Industry conferences, partnerships with academia

### Change Management for AI Adoption

Implementing AI often represents significant change. A structured approach should include:

- **Stakeholder Analysis**: Identifying key groups and their concerns
- **Communication Planning**: Crafting targeted messages for different audiences
- **Adoption Roadmap**: Defining the journey from awareness to proficiency
- **Success Stories**: Showcasing internal wins to build momentum

Remember that the human element is often the most challenging aspect of building an AI Center of Excellence. Technical solutions only create value when people adopt and effectively use them.`,
      transition: "Now, let's look toward the future of AI innovation..."
    },
    {
      personaId: "innovator",
      content: `## Future-Proofing Your AI Center of Excellence

As we look ahead, your AI CoE must be designed not just for today's challenges but also for tomorrow's opportunities. Let's explore how to build innovation into the fabric of your CoE.

### Emerging AI Technologies to Watch

Your CoE should establish processes for evaluating and incorporating emerging technologies:

- **Multimodal AI**: Systems that combine text, vision, audio, and other modalities
- **Generative AI**: Creating original content across different media types
- **Edge AI**: Moving intelligence closer to data sources for speed and privacy
- **Autonomous Systems**: Self-improving AI with minimal human intervention
- **AI + Quantum Computing**: Accelerating certain AI workloads with quantum approaches

### Innovation Processes

Create structured approaches to foster innovation:

1. **Technology Radar**
   - Regularly assess emerging technologies for potential impact
   - Categorize as "Adopt," "Trial," "Assess," or "Hold"

2. **Innovation Sprints**
   - Dedicate time for teams to explore new approaches
   - Create rapid prototyping frameworks for quick testing

3. **External Ecosystem Development**
   - Build relationships with startups, academic institutions
   - Participate in open source communities to stay at the forefront

### Ethical AI and Responsible Innovation

Future-proofing requires building responsibility into innovation:

- **Ethics by Design**: Incorporate ethical considerations from the earliest stages
- **Participatory Design**: Include diverse stakeholders in development
- **Impact Assessment**: Evaluate potential consequences before deployment
- **Continuous Monitoring**: Track systems for unexpected behaviors or outcomes

### Scaling Innovation

Moving from innovative ideas to scaled solutions requires:

- **Innovation to Production Pipeline**: Clear path from experimentation to implementation
- **Scale-Up Infrastructure**: Systems designed to grow with successful innovations
- **Knowledge Management**: Capturing learnings from both successes and failures

By embedding innovation processes into your AI CoE, you create a renewable source of value that can adapt to changing technologies, business needs, and societal expectations.

Remember that innovation isn't just about the newest technology—it's about creating new value through the thoughtful application of technology to important problems.`
    }
  ];
  
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="pt-28 pb-20 relative"
    >
      <ProgressTracker postId={postId} progress={readingProgress} />
      
      {/* Floating action buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col gap-2 z-50">
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={scrollToTop}
            className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
          >
            <ChevronUp className="h-6 w-6" />
          </motion.button>
        )}
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 max-w-4xl mx-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/blog")}
            className="text-muted-foreground"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Blog
          </Button>
        </div>
      
        <div className="max-w-4xl mx-auto" ref={contentRef}>
          {/* Header */}
          <div className="pb-4 pt-2 space-y-6 mb-8">
            <Badge variant="outline" className="uppercase">{post.category}</Badge>
            <h1 className="text-3xl md:text-5xl font-clash font-bold">{post.title}</h1>
            <p className="text-xl text-muted-foreground">{post.excerpt}</p>
            
            <div className="flex items-center justify-between border-b border-border pb-6">
              <div className="flex items-center">
                <div className="ml-3">
                  <p className="font-medium">Multi-Perspective Collaboration</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="mx-2">•</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{post.readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Cover Image */}
          {post.imageUrl && (
            <div className="mb-12">
              <img 
                src={post.imageUrl} 
                alt={post.title} 
                className="w-full h-auto rounded-xl shadow-md"
              />
            </div>
          )}
          
          {/* Collaborative Content */}
          <CollaborativeBlogContent sections={blogSections} className="mb-12" />
          
          {/* Article actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between bg-muted/30 rounded-lg p-6 mb-12">
            <div className="flex items-center mb-4 sm:mb-0">
              <Button variant="outline" size="sm" className="mr-2" onClick={() => toast({ title: "Thanks for the feedback!" })}>
                <ThumbsUp className="h-4 w-4 mr-2" />
                Helpful
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8"
                onClick={() => copyToClipboard(window.location.href)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 text-[#1DA1F2]"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank')}
              >
                <Twitter className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full h-8 w-8 text-[#0A66C2]"
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank')}
              >
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Interactive Quiz */}
          <div className="mb-16">
            <h2 className="text-2xl font-clash font-bold mb-6">Assess Your AI Center of Excellence Readiness</h2>
            <InteractiveBlogQuiz
              title="AI Center of Excellence Assessment"
              description="Answer the following questions to evaluate your organization's readiness for establishing an AI Center of Excellence and receive personalized recommendations."
              questions={aiCoeQuizQuestions}
              onComplete={handleQuizComplete}
              primaryColor="#00C2FF"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CollaborativeBlogPost;