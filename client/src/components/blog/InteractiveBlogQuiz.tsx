import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { fadeIn } from '@/lib/animations';
import { CheckCircle, Download, Mail, Send } from 'lucide-react';

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
  primaryColor = 'hsl(var(--primary))',
  className = '',
}) => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [emailLoading, setEmailLoading] = useState(false);
  
  const form = useForm<QuizAnswers>({
    defaultValues: questions.reduce((acc, question) => {
      if (question.type === 'checkbox') {
        acc[question.id] = [];
      } else if (question.type === 'rating') {
        acc[question.id] = 5;
      } else {
        acc[question.id] = '';
      }
      return acc;
    }, {} as QuizAnswers),
  });
  
  const handleSubmit = (data: QuizAnswers) => {
    setSubmitLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (onComplete) {
        onComplete(data);
      }
      
      setSubmitted(true);
      setSubmitLoading(false);
      
      toast({
        title: 'Quiz submitted successfully',
        description: 'Thank you for your feedback',
      });
    }, 1000);
  };
  
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setEmailLoading(false);
      setShowEmailForm(false);
      
      toast({
        title: 'Results sent to your email',
        description: 'Check your inbox for your results and personalized recommendations',
      });
    }, 1500);
  };
  
  const generatePDF = () => {
    const doc = new jsPDF();
    const answers = form.getValues();
    const logoUrl = '/logo.png'; // Placeholder for your logo
    
    // Add header
    doc.setFontSize(22);
    doc.setTextColor(0, 44, 82);
    doc.text(title, 20, 20);
    
    // Add subtitle
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text('Your Personalized Results', 20, 30);
    
    // Add date
    const today = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated on ${today}`, 20, 38);
    
    let yPos = 50;
    
    // Add content
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    
    questions.forEach((question, index) => {
      // Add question
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(`${index + 1}. ${question.question}`, 20, yPos);
      yPos += 7;
      
      // Add answer
      doc.setFont('helvetica', 'normal');
      let answerText = '';
      
      if (question.type === 'multiple-choice') {
        const selectedOption = question.options?.find((_, i) => answers[question.id] === String(i));
        answerText = `Your answer: ${selectedOption || answers[question.id]}`;
      } else if (question.type === 'checkbox' && Array.isArray(answers[question.id])) {
        const selectedOptions = (answers[question.id] as string[])
          .map(optionIndex => question.options?.[parseInt(optionIndex)])
          .filter(Boolean);
        answerText = `Your selections: ${selectedOptions.join(', ')}`;
      } else if (question.type === 'rating') {
        answerText = `Your rating: ${answers[question.id]}/10`;
      } else {
        answerText = `Your answer: ${answers[question.id]}`;
      }
      
      doc.text(answerText, 25, yPos);
      yPos += 15;
      
      // Add page if needed
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
    });
    
    // Add footer
    const lastPage = doc.getNumberOfPages();
    doc.setPage(lastPage);
    yPos = 280;
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text('Thank you for completing this assessment.', 20, yPos);
    doc.text('© FrankX.AI - Center of Excellence', 20, yPos + 5);
    
    // Save PDF
    doc.save(`frankx-ai-${title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };
  
  if (submitted) {
    return (
      <motion.div
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        className={className}
      >
        <Card className="border-t-4" style={{ borderTopColor: primaryColor }}>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
              Thank you for completing the quiz!
            </CardTitle>
            <CardDescription>
              Your responses have been recorded and will help personalize your experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Would you like to receive your results and personalized recommendations via email or download them as a PDF?
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowEmailForm(true)} 
                className="flex-1"
                disabled={showEmailForm}
              >
                <Mail className="mr-2 h-4 w-4" />
                Receive by Email
              </Button>
              <Button 
                onClick={generatePDF} 
                className="flex-1" 
                style={{ backgroundColor: primaryColor }}
              >
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
            
            {showEmailForm && (
              <motion.form 
                initial={{ height: 0, opacity: 0 }} 
                animate={{ height: 'auto', opacity: 1 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSendEmail}
                className="mt-4 border rounded-md p-4"
              >
                <Label htmlFor="email">Email address</Label>
                <div className="flex items-center gap-2 mt-2">
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your@email.com" 
                    value={userEmail} 
                    onChange={(e) => setUserEmail(e.target.value)} 
                    required 
                  />
                  <Button type="submit" disabled={emailLoading} size="sm">
                    {emailLoading ? 'Sending...' : 'Send'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  We'll email you the results and custom recommendations based on your answers.
                </p>
              </motion.form>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={className}
    >
      <Card className="border-t-4" style={{ borderTopColor: primaryColor }}>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
              {questions.map((question, index) => (
                <div key={question.id} className="border-b pb-6 last:border-0">
                  <h3 className="text-lg font-medium mb-3 flex">
                    <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center mr-2 text-sm font-semibold flex-shrink-0">
                      {index + 1}
                    </span>
                    <span>{question.question}</span>
                    {question.isRequired && <span className="text-red-500 ml-1">*</span>}
                  </h3>
                  
                  {/* Multiple Choice Question */}
                  {question.type === 'multiple-choice' && (
                    <FormField
                      control={form.control}
                      name={question.id}
                      rules={{ required: question.isRequired ? 'This field is required' : false }}
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value as string}
                              className="space-y-1"
                            >
                              {question.options?.map((option, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                  <RadioGroupItem value={String(i)} id={`${question.id}-${i}`} />
                                  <Label 
                                    htmlFor={`${question.id}-${i}`}
                                    className="text-sm"
                                  >
                                    {option}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {/* Checkbox Question */}
                  {question.type === 'checkbox' && (
                    <FormField
                      control={form.control}
                      name={question.id}
                      render={({ field }) => (
                        <FormItem>
                          <div className="space-y-2">
                            {question.options?.map((option, i) => (
                              <div key={i} className="flex items-start space-x-2">
                                <Checkbox
                                  id={`${question.id}-${i}`}
                                  checked={(field.value as string[]).includes(String(i))}
                                  onCheckedChange={(checked) => {
                                    const currentValue = [...(field.value as string[] || [])];
                                    if (checked) {
                                      field.onChange([...currentValue, String(i)]);
                                    } else {
                                      field.onChange(
                                        currentValue.filter(value => value !== String(i))
                                      );
                                    }
                                  }}
                                />
                                <Label
                                  htmlFor={`${question.id}-${i}`}
                                  className="text-sm leading-tight pt-0.5"
                                >
                                  {option}
                                </Label>
                              </div>
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {/* Text Question */}
                  {question.type === 'text' && (
                    <FormField
                      control={form.control}
                      name={question.id}
                      rules={{ required: question.isRequired ? 'This field is required' : false }}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea
                              placeholder="Type your answer here..."
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Please provide as much detail as possible.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  {/* Rating Question */}
                  {question.type === 'rating' && (
                    <FormField
                      control={form.control}
                      name={question.id}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="space-y-3">
                              <Slider
                                min={1}
                                max={10}
                                step={1}
                                defaultValue={[field.value as number]}
                                onValueChange={(vals) => field.onChange(vals[0])}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground px-1">
                                <span>Not important</span>
                                <span>Very important</span>
                              </div>
                              <div className="text-center font-medium">
                                Rating: {field.value}/10
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
              ))}
              
              <Button 
                type="submit" 
                disabled={submitLoading}
                className="w-full sm:w-auto"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="mr-2 h-4 w-4" />
                {submitLoading ? 'Submitting...' : 'Submit Answers'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col items-start border-t pt-6">
          <p className="text-xs text-muted-foreground">
            Your responses will be used to provide you with personalized recommendations and insights.
            After submitting, you'll have the option to download your results or receive them via email.
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default InteractiveBlogQuiz;