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
    <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
      <h3 className="font-clash font-bold text-xl mb-6">AI Characters</h3>
      
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        {characters.map((character) => (
          <motion.div 
            key={character.id}
            className={`flex items-center p-3 rounded-xl cursor-pointer transition-colors duration-200 ${
              selectedCharacter?.id === character.id 
                ? `bg-${getIconColor(character.icon)} bg-opacity-5 border-2 border-${getIconColor(character.icon)}` 
                : 'hover:bg-gray-50'
            }`}
            variants={itemVariants}
            onClick={() => onSelectCharacter(character)}
          >
            <div className={`w-12 h-12 rounded-full bg-${getIconColor(character.icon)} bg-opacity-10 flex items-center justify-center`}>
              {getIcon(character.icon)}
            </div>
            <div className="ml-3">
              <h4 className="font-medium">{character.name}</h4>
              <p className="text-xs text-overlay">{character.description}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CharacterSelector;
