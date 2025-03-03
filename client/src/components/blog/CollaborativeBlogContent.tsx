import React from 'react';
import { motion } from 'framer-motion';
import { getPersonaById } from '@/lib/ai-personas';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { fadeIn } from '@/lib/animations';
import EnhancedBlogContent from './EnhancedBlogContent';

export interface PersonaSection {
  personaId: string;
  content: string;
  transition?: string;
}

interface CollaborativeBlogContentProps {
  sections: PersonaSection[];
  className?: string;
}

const CollaborativeBlogContent: React.FC<CollaborativeBlogContentProps> = ({ 
  sections,
  className = ''
}) => {
  return (
    <div className={cn("space-y-8", className)}>
      {sections.map((section, index) => {
        const isDefault = section.personaId === 'default';
        const persona = isDefault 
          ? { name: 'FrankX.AI', color: 'hsl(var(--primary))', accentColor: 'hsl(var(--primary))' } 
          : getPersonaById(section.personaId);
        
        return (
          <motion.div
            key={`${section.personaId}-${index}`}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative"
          >
            {!isDefault && (
              <div 
                className="absolute left-0 top-0 w-1 h-full rounded-full" 
                style={{ backgroundColor: persona.color }}
              />
            )}
            
            <div className={cn(
              "pl-4",
              isDefault ? "" : "ml-2"
            )}>
              {!isDefault && (
                <div 
                  className="inline-flex items-center mb-2 px-3 py-1 text-sm font-medium rounded-full"
                  style={{ 
                    backgroundColor: `${persona.color}15`, // 15% opacity
                    color: persona.color 
                  }}
                >
                  {persona.name}
                </div>
              )}
              
              <EnhancedBlogContent content={section.content} />
              
              {section.transition && (
                <Card className="mt-6 p-4 border border-border/50 bg-muted/30">
                  <p className="text-sm italic text-muted-foreground">
                    {section.transition}
                  </p>
                </Card>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default CollaborativeBlogContent;