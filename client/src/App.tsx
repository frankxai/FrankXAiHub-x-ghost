import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import CollaborativeBlogPost from "@/pages/CollaborativeBlogPost";
import CreatePromptEngineeringPost from "@/pages/CreatePromptEngineeringPost";
import Resources from "@/pages/Resources";
import Conversation from "@/pages/Conversation";
import Music from "@/pages/Music";
import Assessment from "@/pages/Assessment";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FrankXAI from "@/components/ai/FrankXAI";
import { ThemeProvider } from "@/hooks/use-theme";
import { AnimatePresence } from "framer-motion";
import FileConversionPage from "@/pages/FileConversionPage";
import AgentManagementPage from '@/pages/AgentManagementPage';
import ChatWithAgentPage from '@/pages/ChatWithAgentPage';
import ChatWithAgentFullScreen from '@/pages/ChatWithAgentFullScreen';
import AgentConversationPage from '@/pages/AgentConversationPage';
import Dashboard from '@/pages/Dashboard';


function Router() {
  const [location] = useLocation();
  
  // Check if current route is full screen chat (to hide header/footer)
  const isFullScreenChat = location.startsWith('/chat-fullscreen/');
  
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogPost} />
        <Route path="/collaborative-blog/:id" component={CollaborativeBlogPost} />
        <Route path="/create-prompt-engineering-post" component={CreatePromptEngineeringPost} />
        <Route path="/resources" component={Resources} />
        <Route path="/conversation" component={Conversation} />
        <Route path="/music" component={Music} />
        <Route path="/assessment" component={Assessment} />
        <Route path="/tools/file-converter" component={FileConversionPage} />
        <Route path="/agents" component={AgentManagementPage} />
        <Route path="/chat/:agentId" component={ChatWithAgentPage} />
        <Route path="/chat-fullscreen/:agentId" component={ChatWithAgentFullScreen} />
        <Route path="/agent-conversation/:agentId?" component={AgentConversationPage} />
        <Route path="/dashboard" component={Dashboard} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  const [location] = useLocation();
  
  // Check if current route is full screen chat (to hide header/footer)
  const isFullScreenChat = location.startsWith('/chat-fullscreen/');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="frankx-theme">
        <div className="flex flex-col min-h-screen">
          {!isFullScreenChat && <Header />}
          <main className={`flex-grow ${isFullScreenChat ? 'h-screen' : ''}`}>
            <Router />
          </main>
          {!isFullScreenChat && <Footer />}
          {!isFullScreenChat && <FrankXAI />}
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;