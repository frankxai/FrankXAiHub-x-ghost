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
import { INDUSTRIES, ORG_SIZES, AI_OBJECTIVES } from "@/lib/constants";

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
    <Card className="max-w-4xl mx-auto shadow-md overflow-hidden">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center">
                <span className="text-sm font-medium">1</span>
              </div>
              <span className="ml-3 font-clash font-bold">Organization Information</span>
              <div className="ml-auto hidden sm:block">
                <span className="text-sm text-overlay">Step 1 of 4</span>
              </div>
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {INDUSTRIES.map((industry, index) => (
                          <SelectItem 
                            key={index} 
                            value={index === 0 ? "" : industry}
                            disabled={index === 0}
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
                        <SelectTrigger>
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ORG_SIZES.map((size, index) => (
                          <SelectItem 
                            key={index} 
                            value={index === 0 ? "" : size}
                            disabled={index === 0}
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
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="objectives"
              render={() => (
                <FormItem>
                  <div className="mb-2">
                    <FormLabel>Primary AI Objectives</FormLabel>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {AI_OBJECTIVES.map((objective) => (
                      <FormField
                        key={objective}
                        control={form.control}
                        name="objectives"
                        render={({ field }) => {
                          return (
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
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
                              <FormLabel className="text-sm font-normal cursor-pointer">
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
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="bg-secondary hover:bg-secondary/90 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Continue to Next Step"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AssessmentForm;
