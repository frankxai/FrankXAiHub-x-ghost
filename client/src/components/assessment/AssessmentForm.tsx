import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { InsertAssessment, Assessment, insertAssessmentSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { INDUSTRIES, ORG_SIZES, AI_OBJECTIVES } from "@/lib/constants";
import { ArrowRight, CheckCircle2, BarChart2, Building2 } from "lucide-react";

interface AssessmentFormProps {
  onComplete: (assessment: Assessment) => void;
}

const AssessmentForm = ({ onComplete }: AssessmentFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<InsertAssessment>({
    resolver: zodResolver(insertAssessmentSchema),
    defaultValues: {
      organizationName: "",
      industry: "",
      size: "",
      role: "",
      objectives: [],
    },
  });
  
  const onSubmit = async (data: InsertAssessment) => {
    setIsSubmitting(true);
    
    try {
      const response = await apiRequest("POST", "/api/assessments", data);
      const assessmentResult = await response.json();
      
      toast({
        title: "Assessment Submitted",
        description: "Your AI maturity assessment has been processed successfully.",
      });
      
      onComplete(assessmentResult);
    } catch (error) {
      console.error("Error submitting assessment:", error);
      
      toast({
        title: "Submission Failed",
        description: "There was an error processing your assessment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto shadow-xl rounded-xl overflow-hidden border-0">
      <CardContent className="p-0">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
          <h2 className="font-clash text-2xl font-bold text-primary">Enterprise AI Maturity Assessment</h2>
          <p className="text-muted-foreground mt-2">Analyze your organization's AI readiness and receive a customized transformation roadmap</p>
        </div>
        
        <div className="p-8">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-md">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-clash font-bold text-lg">Organization Profile</h3>
                    <p className="text-sm text-muted-foreground">Help us understand your business context</p>
                  </div>
                  <Badge variant="outline" className="ml-auto">
                    Step 1 of 4
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="organizationName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Name</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your organization name" 
                            className="h-11"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="industry"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Industry</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select your industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {INDUSTRIES.slice(1).map((industry) => (
                              <SelectItem 
                                key={industry} 
                                value={industry}
                              >
                                {industry}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organization Size</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-11">
                              <SelectValue placeholder="Select organization size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {ORG_SIZES.slice(1).map((size) => (
                              <SelectItem 
                                key={size} 
                                value={size}
                              >
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Role</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter your job title" 
                            className="h-11"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <FormField
                  control={form.control}
                  name="objectives"
                  render={() => (
                    <FormItem className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-secondary text-white flex items-center justify-center shadow-md">
                          <BarChart2 className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <FormLabel className="text-lg font-bold block">Strategic Objectives</FormLabel>
                          <p className="text-sm text-muted-foreground">Select all applicable objectives for your AI initiatives</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pl-14">
                        {AI_OBJECTIVES.map((objective) => (
                          <FormField
                            key={objective}
                            control={form.control}
                            name="objectives"
                            render={({ field }) => {
                              return (
                                <FormItem className="flex items-center space-x-3 space-y-0 p-3 rounded-lg border transition-colors hover:bg-muted/40">
                                  <FormControl>
                                    <Checkbox
                                      className="data-[state=checked]:bg-secondary"
                                      checked={field.value?.includes(objective)}
                                      onCheckedChange={(checked) => {
                                        const updatedValue = checked
                                          ? [...field.value, objective]
                                          : field.value.filter(
                                              (value) => value !== objective
                                            );
                                        field.onChange(updatedValue);
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="text-base font-medium cursor-pointer">
                                    {objective}
                                  </FormLabel>
                                </FormItem>
                              );
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              
              <motion.div 
                className="flex justify-end pt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.4 }}
              >
                <Button 
                  type="submit" 
                  className="bg-secondary hover:bg-secondary/90 text-white h-12 px-8 group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing Assessment...
                    </>
                  ) : (
                    <>
                      Generate AI Transformation Roadmap
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssessmentForm;
