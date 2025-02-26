import { useState } from "react";
import type { AICharacter } from "@shared/schema";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/animations";
import { Brain, Bot, Code, Briefcase } from "lucide-react";

interface CharacterSelectorProps {
  characters: AICharacter[];
  selectedCharacter: AICharacter | null;
  onSelectCharacter: (character: AICharacter) => void;
}

const CharacterSelector = ({ 
  characters, 
  selectedCharacter, 
  onSelectCharacter 
}: CharacterSelectorProps) => {
  
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'robot':
        return <Bot className="h-5 w-5" />;
      case 'chart-line':
        return <Brain className="h-5 w-5" />;
      case 'code':
        return <Code className="h-5 w-5" />;
      case 'briefcase':
        return <Briefcase className="h-5 w-5" />;
      default:
        return <Bot className="h-5 w-5" />;
    }
  };
  
  const getIconColor = (iconName: string) => {
    switch (iconName) {
      case 'robot':
        return "secondary";
      case 'chart-line':
        return "primary";
      case 'code':
        return "accent";
      case 'briefcase':
        return "gray-700";
      default:
        return "secondary";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 sticky top-24 border border-gray-100 dark:border-gray-700">
      <h3 className="font-clash font-bold text-xl mb-6 dark:text-white">AI Characters</h3>
      
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {characters.map((character) => {
          // Use explicit color values instead of dynamic classes
          const getSelectedBgColor = () => {
            switch(character.icon) {
              case 'robot': return 'bg-[#00C2FF]/5 border-[#00C2FF]';
              case 'chart-line': return 'bg-[#171717]/5 border-[#171717] dark:border-white dark:bg-white/5';
              case 'code': return 'bg-[#FF3366]/5 border-[#FF3366]';
              case 'briefcase': return 'bg-[#555555]/5 border-[#555555] dark:border-gray-400';
              default: return 'bg-[#00C2FF]/5 border-[#00C2FF]';
            }
          };
          
          const getBgColor = () => {
            switch(character.icon) {
              case 'robot': return 'bg-[#00C2FF]/10 dark:bg-[#00C2FF]/20';
              case 'chart-line': return 'bg-[#171717]/10 dark:bg-white/10';
              case 'code': return 'bg-[#FF3366]/10 dark:bg-[#FF3366]/20';
              case 'briefcase': return 'bg-gray-700/10 dark:bg-gray-400/20';
              default: return 'bg-[#00C2FF]/10 dark:bg-[#00C2FF]/20';
            }
          };
          
          return (
            <motion.div 
              key={character.id}
              className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors duration-200 ${
                selectedCharacter?.id === character.id 
                  ? `${getSelectedBgColor()} border-2`
                  : 'hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              variants={itemVariants}
              onClick={() => onSelectCharacter(character)}
            >
              <div className={`w-12 h-12 rounded-full ${getBgColor()} flex items-center justify-center`}>
                {getIcon(character.icon)}
              </div>
              <div className="ml-3">
                <h4 className="font-medium dark:text-white">{character.name}</h4>
                <p className="text-xs text-overlay dark:text-gray-300">{character.description}</p>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};

export default CharacterSelector;
