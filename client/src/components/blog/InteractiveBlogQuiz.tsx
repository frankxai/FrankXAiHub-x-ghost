import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  RadioGroup, 
  RadioGroupItem 
} from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Download, Send, Mail, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import jsPDF from 'jspdf';

// Question types
export type QuizQuestionType = 'multiple-choice' | 'text' | 'checkbox' | 'rating';

export interface QuizQuestion {
  id: string;
  type: QuizQuestionType;
  question: string;
  options?: string[];
  isRequired?: boolean;
}

export interface QuizAnswers {
  [questionId: string]: string | string[] | number;
}

interface InteractiveBlogQuizProps {
  title: string;
  description: string;
  questions: QuizQuestion[];
  onComplete?: (answers: QuizAnswers) => void;
  primaryColor?: string;
  className?: string;
}

const InteractiveBlogQuiz: React.FC<InteractiveBlogQuizProps> = ({
  title,
  description,
  questions,
  onComplete,
  primaryColor = '#00C2FF',
  className = '',
}) => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswers>({});
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  // Calculate progress percentage
  const progress = (currentStep / (questions.length + 1)) * 100;
  
  const handleNext = () => {
    const currentQuestion = questions[currentStep];
    
    // Check if the current question is required and has an answer
    if (currentQuestion?.isRequired && !answers[currentQuestion.id]) {
      toast({
        title: "Required Field",
        description: "Please answer this question before continuing.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep < questions.length) {
      setCurrentStep(currentStep + 1);
    } else {
      completeQuiz();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleAnswer = (questionId: string, answer: string | string[] | number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };
  
  const completeQuiz = () => {
    setQuizCompleted(true);
    if (onComplete) {
      onComplete(answers);
    }
  };
  
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    // In a real app, you would send the email + answers to a backend
    setEmailSubmitted(true);
    toast({
      title: "Results Sent!",
      description: "Check your inbox for the results of your assessment.",
    });
  };
  
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text(title, 20, 20);
    
    // Add description
    doc.setFontSize(12);
    doc.text(description, 20, 30, { maxWidth: 170 });
    
    // Add answers
    doc.setFontSize(14);
    doc.text("Your Answers:", 20, 50);
    
    let yPosition = 60;
    questions.forEach((question, index) => {
      doc.setFontSize(12);
      doc.text(`${index + 1}. ${question.question}`, 20, yPosition);
      yPosition += 7;
      
      doc.setFontSize(10);
      const answer = answers[question.id];
      
      if (Array.isArray(answer)) {
        answer.forEach(a => {
          doc.text(`• ${a}`, 25, yPosition);
          yPosition += 5;
        });
      } else if (typeof answer === 'number') {
        doc.text(`Rating: ${answer}/5`, 25, yPosition);
        yPosition += 5;
      } else {
        doc.text(`${answer || "Not answered"}`, 25, yPosition);
        yPosition += 5;
      }
      
      yPosition += 5;
    });
    
    // Add current date
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on ${date}`, 20, 270);
    
    // Save PDF
    doc.save(`${title.replace(/\s+/g, '-').toLowerCase()}-results.pdf`);
    
    toast({
      title: "PDF Generated!",
      description: "Your answers have been saved as a PDF.",
    });
  };
  
  // Render current question or final step
  const renderStep = () => {
    // Final step
    if (currentStep >= questions.length) {
      return (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block p-3 rounded-full bg-primary/10 mb-4"
            >
              <CheckCircle size={48} className="text-primary" />
            </motion.div>
            <h3 className="text-xl font-bold">Assessment Complete!</h3>
            <p className="text-muted-foreground mt-2">
              Thank you for taking the time to complete this assessment. Your insights will help improve your AI Center of Excellence journey.
            </p>
          </div>
          
          <div className="space-y-4">
            <Button 
              onClick={generatePDF} 
              variant="outline" 
              className="w-full" 
              style={{ borderColor: `${primaryColor}40`, color: primaryColor }}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Your Results as PDF
            </Button>
            
            {!emailSubmitted ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Get your results by email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full"
                  style={{ backgroundColor: primaryColor }}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Send to My Email
                </Button>
              </form>
            ) : (
              <div className="text-center p-4 border rounded-md bg-primary/5 border-primary/20">
                <p className="text-sm font-medium">Results sent to {email}</p>
              </div>
            )}
          </div>
        </div>
      );
    }
    
    // Current question
    const currentQuestion = questions[currentStep];
    
    return (
      <div>
        <h3 className="text-lg font-medium mb-4">{currentQuestion.question}</h3>
        
        {currentQuestion.type === 'multiple-choice' && (
          <RadioGroup
            value={answers[currentQuestion.id] as string}
            onValueChange={(value) => handleAnswer(currentQuestion.id, value)}
            className="space-y-3"
          >
            {currentQuestion.options?.map((option, i) => (
              <div key={i} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`option-${currentQuestion.id}-${i}`} />
                <Label htmlFor={`option-${currentQuestion.id}-${i}`}>{option}</Label>
              </div>
            ))}
          </RadioGroup>
        )}
        
        {currentQuestion.type === 'checkbox' && (
          <div className="space-y-3">
            {currentQuestion.options?.map((option, i) => {
              const currentAnswers = (answers[currentQuestion.id] as string[]) || [];
              return (
                <div key={i} className="flex items-center space-x-2">
                  <Checkbox
                    id={`option-${currentQuestion.id}-${i}`}
                    checked={currentAnswers.includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleAnswer(currentQuestion.id, [...currentAnswers, option]);
                      } else {
                        handleAnswer(
                          currentQuestion.id,
                          currentAnswers.filter(item => item !== option)
                        );
                      }
                    }}
                  />
                  <Label htmlFor={`option-${currentQuestion.id}-${i}`}>{option}</Label>
                </div>
              );
            })}
          </div>
        )}
        
        {currentQuestion.type === 'text' && (
          <Textarea
            placeholder="Your answer here..."
            value={answers[currentQuestion.id] as string || ''}
            onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
            className="min-h-[120px]"
          />
        )}
        
        {currentQuestion.type === 'rating' && (
          <div className="space-y-3">
            <div className="flex justify-between px-2">
              <span className="text-sm text-muted-foreground">Not at all</span>
              <span className="text-sm text-muted-foreground">Very much</span>
            </div>
            <div className="flex space-x-2 justify-between">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant="outline"
                  className={`flex-1 h-12 ${answers[currentQuestion.id] === rating ? 'bg-primary/20 border-primary' : ''}`}
                  onClick={() => handleAnswer(currentQuestion.id, rating)}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-4" style={{ borderBottom: `1px solid ${primaryColor}20` }}>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        
        <div className="px-6 py-2">
          <Progress value={progress} className="h-2" style={{ backgroundColor: `${primaryColor}20` }}>
            <div className="h-full" style={{ backgroundColor: primaryColor }} />
          </Progress>
          <p className="text-xs text-muted-foreground mt-1">
            Question {Math.min(currentStep + 1, questions.length)} of {questions.length}
          </p>
        </div>
        
        <CardContent className="pt-6 pb-4">
          {renderStep()}
        </CardContent>
        
        <CardFooter className="flex justify-between border-t py-4 px-6">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            Previous
          </Button>
          
          {currentStep < questions.length && (
            <Button 
              onClick={handleNext}
              style={{ backgroundColor: primaryColor }}
            >
              {currentStep === questions.length - 1 ? 'Complete' : 'Next'}
              <Send className="ml-2 h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default InteractiveBlogQuiz;