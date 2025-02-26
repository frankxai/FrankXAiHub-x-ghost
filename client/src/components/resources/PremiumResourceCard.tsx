
import { useState } from "react";
import { Resource } from "@shared/schema";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Download, CreditCard, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface PremiumResourceCardProps {
  resource: Resource & { 
    isPremium?: boolean;
    price?: string;
    affiliateCode?: string;
  };
}

const PremiumResourceCard = ({ resource }: PremiumResourceCardProps) => {
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchased, setPurchased] = useState(false);
  
  const handlePurchase = () => {
    setIsPurchasing(true);
    
    // Simulate purchase process
    setTimeout(() => {
      setIsPurchasing(false);
      setPurchased(true);
      
      // If it's an affiliate link, track it
      if (resource.affiliateCode) {
        trackAffiliateClick(resource.id, resource.affiliateCode);
      }
    }, 1500);
  };
  
  const trackAffiliateClick = async (resourceId: number, affiliateCode: string) => {
    try {
      await fetch('/api/track-affiliate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resourceId,
          affiliateCode,
        }),
      });
    } catch (error) {
      console.error('Error tracking affiliate click:', error);
    }
  };
  
  const handleDownload = () => {
    // Track download
    fetch('/api/track-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resourceId: resource.id,
      }),
    }).catch(console.error);
    
    // If external URL, open in new tab
    if (resource.link.startsWith('http')) {
      window.open(resource.link, '_blank');
    } else {
      // Otherwise download the file
      window.location.href = resource.link;
    }
  };
  
  const IconComponent = () => {
    const iconMap: Record<string, any> = {
      'file-pdf': <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>,
      'play-circle': <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>,
      'table': <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>,
      'clipboard-list': <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>,
    };
    
    return iconMap[resource.icon] || iconMap['file-pdf'];
  };
  
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full bg-white/5 backdrop-blur-sm border border-zinc-200/30 dark:border-zinc-700/30 hover:border-secondary/50 transition-all duration-300">
        <CardContent className="pt-6">
          <div className="relative mb-4">
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
              <IconComponent />
            </div>
            
            {resource.isPremium && !purchased && (
              <div className="absolute top-0 right-0">
                <div className="bg-secondary text-white text-xs px-2 py-1 rounded-full font-medium flex items-center">
                  <Lock className="w-3 h-3 mr-1" />
                  Premium
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center pt-2">
            <h3 className="font-clash font-bold text-lg mb-2">{resource.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{resource.description}</p>
            
            {resource.isPremium && !purchased ? (
              <div className="inline-block bg-secondary/10 text-secondary font-medium px-3 py-1 rounded-full text-sm">
                ${resource.price}
              </div>
            ) : purchased ? (
              <div className="inline-block bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium px-3 py-1 rounded-full text-sm">
                Purchased
              </div>
            ) : (
              <div className="inline-block bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400 font-medium px-3 py-1 rounded-full text-sm">
                Free
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center pb-6">
          {resource.isPremium && !purchased ? (
            <Button 
              onClick={handlePurchase}
              className="w-full"
              disabled={isPurchasing}
            >
              {isPurchasing ? (
                <span>Processing...</span>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Purchase Access
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={handleDownload}
              variant="secondary"
              className="w-full"
            >
              {resource.link.startsWith('http') ? (
                <>
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Resource
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </>
              )}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default PremiumResourceCard;
