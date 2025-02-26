import type { Resource } from "@shared/schema";
import { motion } from "framer-motion";
import { 
  FileText, 
  Play, 
  Table, 
  ClipboardList, 
  Download,
  ExternalLink
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard = ({ resource }: ResourceCardProps) => {
  const { title, description, type, icon, link } = resource;
  
  const getIcon = () => {
    switch (icon) {
      case 'file-pdf':
        return <FileText className="text-2xl text-[#00C2FF] dark:text-[#00C2FF]" />;
      case 'play-circle':
        return <Play className="text-2xl text-[#FF3366] dark:text-[#FF3366]" />;
      case 'table':
        return <Table className="text-2xl text-[#00C2FF] dark:text-[#00C2FF]" />;
      case 'clipboard-list':
        return <ClipboardList className="text-2xl text-[#FF3366] dark:text-[#FF3366]" />;
      default:
        return <FileText className="text-2xl text-[#00C2FF] dark:text-[#00C2FF]" />;
    }
  };
  
  const getLinkIcon = () => {
    return type === 'pdf' || type === 'template' 
      ? <Download className="ml-2 h-4 w-4" /> 
      : <ExternalLink className="ml-2 h-4 w-4" />;
  };
  
  const getLinkText = () => {
    switch (type) {
      case 'pdf':
        return 'Download PDF';
      case 'video':
        return 'Watch Now';
      case 'template':
        return 'Download Template';
      case 'checklist':
        return 'Access Checklist';
      default:
        return 'View Resource';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="h-full border border-gray-100 dark:border-gray-700 dark:bg-gray-800">
        <CardContent className="p-6">
          <div className="mb-4">
            {getIcon()}
          </div>
          <h3 className="font-clash font-bold text-lg mb-2 dark:text-white">{title}</h3>
          <p className="text-sm text-overlay dark:text-gray-300 mb-4">{description}</p>
          <a 
            href={link} 
            className="text-sm font-medium text-[#00C2FF] dark:text-[#00C2FF] flex items-center hover:text-[#0099CC] dark:hover:text-[#33CCFF] transition-colors"
            target="_blank" 
            rel="noopener noreferrer"
          >
            {getLinkText()} {getLinkIcon()}
          </a>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ResourceCard;
