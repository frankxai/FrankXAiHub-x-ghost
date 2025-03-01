import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Resources from "@/pages/Resources";
import Conversation from "@/pages/Conversation";
import Music from "@/pages/Music";
import Assessment from "@/pages/Assessment";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import FrankXAI from "@/components/ai/FrankXAI";
import { ThemeProvider } from "@/hooks/use-theme";
import { AnimatePresence } from "framer-motion";

function Router() {
  return (
    <AnimatePresence mode="wait">
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/blog" component={Blog} />
        <Route path="/blog/:id" component={BlogPost} />
        <Route path="/resources" component={Resources} />
        <Route path="/conversation" component={Conversation} />
        <Route path="/music" component={Music} />
        <Route path="/assessment" component={Assessment} />
        <Route component={NotFound} />
      </Switch>
    </AnimatePresence>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="frankx-theme">
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
          <FrankXAI />
        </div>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
