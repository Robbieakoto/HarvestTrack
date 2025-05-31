'use client';

import React, { useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { predictDelay, type PredictDelayInput, type PredictDelayOutput } from '@/ai/flows/predict-delay-analysis';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, BrainCircuit, Loader2, AlertTriangle, CheckCircle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from "@/hooks/use-toast";


const predictDelayFormSchema = z.object({
  shipmentId: z.string().min(1, "Shipment ID is required"),
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  expectedDepartureTime: z.date({ required_error: "Expected departure time is required." }),
  expectedArrivalTime: z.date({ required_error: "Expected arrival time is required." }),
  produceType: z.string().min(1, "Produce type is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

type PredictDelayFormValues = z.infer<typeof predictDelayFormSchema>;

export default function PredictDelayPage() {
  const [predictionResult, setPredictionResult] = useState<PredictDelayOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PredictDelayFormValues>({
    resolver: zodResolver(predictDelayFormSchema),
    defaultValues: {
      shipmentId: '',
      origin: '',
      destination: '',
      produceType: '',
      quantity: 1,
    },
  });

  const onSubmit: SubmitHandler<PredictDelayFormValues> = async (data) => {
    setIsLoading(true);
    setPredictionResult(null);
    try {
      const input: PredictDelayInput = {
        ...data,
        expectedDepartureTime: data.expectedDepartureTime.toISOString(),
        expectedArrivalTime: data.expectedArrivalTime.toISOString(),
      };
      const result = await predictDelay(input);
      setPredictionResult(result);
      toast({
        title: "Prediction Complete",
        description: "Delay analysis has been successfully generated.",
      });
    } catch (error) {
      console.error("Error predicting delay:", error);
      setPredictionResult(null);
       toast({
        variant: "destructive",
        title: "Prediction Failed",
        description: "Could not generate delay analysis. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <BrainCircuit className="h-7 w-7 text-primary" />
            Predictive Delay Analysis
          </CardTitle>
          <CardDescription>
            Enter shipment details to analyze potential delays using AI.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="shipmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Shipment ID</FormLabel>
                    <FormControl><Input placeholder="e.g., SHPM001" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="produceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Produce Type</FormLabel>
                    <FormControl><Input placeholder="e.g., Organic Avocados" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin</FormLabel>
                    <FormControl><Input placeholder="e.g., San Diego, CA" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destination"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl><Input placeholder="e.g., New York, NY" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedDepartureTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expected Departure Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                         <div className="p-3 border-t border-border">
                          <Input type="time" defaultValue={field.value ? format(field.value, "HH:mm") : ""} 
                            onChange={(e) => {
                              const newDate = field.value || new Date();
                              const [hours, minutes] = e.target.value.split(':');
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              field.onChange(newDate);
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="expectedArrivalTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Expected Arrival Time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                          >
                            {field.value ? format(field.value, "PPP HH:mm") : <span>Pick a date and time</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        <div className="p-3 border-t border-border">
                           <Input type="time" defaultValue={field.value ? format(field.value, "HH:mm") : ""}
                            onChange={(e) => {
                              const newDate = field.value || new Date();
                              const [hours, minutes] = e.target.value.split(':');
                              newDate.setHours(parseInt(hours), parseInt(minutes));
                              field.onChange(newDate);
                            }}
                          />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Quantity (units)</FormLabel>
                    <FormControl><Input type="number" placeholder="e.g., 1000" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...</>) : "Analyze Delay Risk"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      {isLoading && (
        <Card className="mt-6">
          <CardContent className="p-6 flex flex-col items-center justify-center text-muted-foreground">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="font-semibold">Analyzing shipment data...</p>
            <p className="text-sm">This may take a few moments.</p>
          </CardContent>
        </Card>
      )}

      {predictionResult && !isLoading && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="font-headline text-xl">Prediction Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {predictionResult.predictedDelayMinutes > 0 ? (
              <div className="flex items-start p-4 bg-destructive/10 border border-destructive rounded-lg">
                <AlertTriangle className="h-6 w-6 text-destructive mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-destructive">Potential Delay Predicted</h3>
                  <p className="text-lg font-bold">{predictionResult.predictedDelayMinutes} minutes delay</p>
                </div>
              </div>
            ) : (
              <div className="flex items-start p-4 bg-green-500/10 border border-green-600 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-green-700">No Significant Delay Predicted</h3>
                  <p>Shipment is likely to be on time.</p>
                </div>
              </div>
            )}
            <div>
              <h4 className="font-semibold mb-1">Reason:</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{predictionResult.delayReason || "N/A"}</p>
            </div>
             <div>
              <h4 className="font-semibold mb-1 flex items-center"><Lightbulb className="h-4 w-4 mr-2 text-primary"/>Suggested Action:</h4>
              <p className="text-sm text-muted-foreground bg-muted p-3 rounded-md">{predictionResult.suggestedAction || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
