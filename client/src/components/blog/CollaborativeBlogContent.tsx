import React from 'react';
import { motion } from 'framer-motion';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Code, BarChart2, Users, Lightbulb, Zap } from 'lucide-react';
import { getPersonaById } from '@/lib/ai-personas';
import EnhancedBlogContent from './EnhancedBlogContent';

interface PersonaSection {
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
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Map persona ids to icons
  const getPersonaIcon = (personaId: string) => {
    switch (personaId) {
      case 'architect':
        return <Code />;
      case 'strategist':
        return <BarChart2 />;
      case 'coach':
        return <Users />;
      case 'innovator':
        return <Lightbulb />;
      default:
        return <Zap />;
    }
  };

  return (
    <div className={className}>
      {sections.map((section, index) => {
        const persona = getPersonaById(section.personaId);
        const isLastSection = index === sections.length - 1;
        const PersonaIcon = () => getPersonaIcon(section.personaId);
        
        return (
          <motion.div
            key={`section-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center mb-6">
              <Avatar className="h-10 w-10 border-2 mr-3" 
                style={{
                  borderColor: persona.color
                }}
              >
                <AvatarFallback 
                  style={{
                    backgroundColor: `${persona.color}15`,
                    color: persona.color
                  }}
                >
                  {getInitials(persona.name)}
                </AvatarFallback>
              </Avatar>
              
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium" style={{ color: persona.color }}>
                    {persona.name}
                  </h3>
                  {persona.id !== 'default' && (
                    <Badge 
                      variant="outline" 
                      className="ml-2 text-xs px-2 py-0"
                      style={{
                        borderColor: `${persona.color}40`,
                        backgroundColor: `${persona.color}10`,
                        color: persona.color
                      }}
                    >
                      {persona.role}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div 
              className="pl-6 border-l-2 pt-2" 
              style={{ 
                borderColor: `${persona.color}40` 
              }}
            >
              <Card 
                className="p-6 mb-6" 
                style={{ 
                  backgroundColor: `${persona.color}05`,
                  borderColor: `${persona.color}15`
                }}
              >
                <EnhancedBlogContent content={section.content} />
              </Card>
            </div>
            
            {!isLastSection && section.transition && (
              <div className="flex items-center my-8">
                <Separator className="flex-grow" />
                <div className="px-4 text-sm text-muted-foreground italic">
                  {section.transition}
                </div>
                <Separator className="flex-grow" />
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
};

export default CollaborativeBlogContent;