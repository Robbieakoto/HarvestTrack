'use server';

/**
 * @fileOverview A flow for predicting potential delays in the delivery schedule.
 *
 * - predictDelay - A function that handles the delay prediction process.
 * - PredictDelayInput - The input type for the predictDelay function.
 * - PredictDelayOutput - The return type for the predictDelay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictDelayInputSchema = z.object({
  shipmentId: z.string().describe('The unique identifier for the shipment.'),
  origin: z.string().describe('The origin location of the shipment.'),
  destination: z.string().describe('The destination location of the shipment.'),
  expectedDepartureTime: z.string().describe('The expected departure time of the shipment (ISO format).'),
  expectedArrivalTime: z.string().describe('The expected arrival time of the shipment (ISO format).'),
  produceType: z.string().describe('The type of produce being shipped.'),
  quantity: z.number().describe('The quantity of produce being shipped.'),
});
export type PredictDelayInput = z.infer<typeof PredictDelayInputSchema>;

const PredictDelayOutputSchema = z.object({
  predictedDelayMinutes: z.number().describe('The predicted delay in minutes.'),
  delayReason: z.string().describe('The predicted reason for the delay.'),
  suggestedAction: z.string().describe('The suggested action to mitigate the delay.'),
});
export type PredictDelayOutput = z.infer<typeof PredictDelayOutputSchema>;

export async function predictDelay(input: PredictDelayInput): Promise<PredictDelayOutput> {
  return predictDelayFlow(input);
}

const trafficConditionsTool = ai.defineTool({
  name: 'getTrafficConditions',
  description: 'Retrieves current traffic conditions between two locations.',
  inputSchema: z.object({
    origin: z.string().describe('The origin location.'),
    destination: z.string().describe('The destination location.'),
  }),
  outputSchema: z.string().describe('A description of the current traffic conditions.'),
});

const weatherConditionsTool = ai.defineTool({
  name: 'getWeatherConditions',
  description: 'Retrieves current weather conditions for a location.',
  inputSchema: z.object({
    location: z.string().describe('The location to get weather conditions for.'),
  }),
  outputSchema: z.string().describe('A description of the current weather conditions.'),
});

const predictDelayPrompt = ai.definePrompt({
  name: 'predictDelayPrompt',
  input: {schema: PredictDelayInputSchema},
  output: {schema: PredictDelayOutputSchema},
  tools: [trafficConditionsTool, weatherConditionsTool],
  prompt: `You are a logistics expert predicting potential delays in produce delivery.

  Analyze the following shipment details:
  - Shipment ID: {{{shipmentId}}}
  - Origin: {{{origin}}}
  - Destination: {{{destination}}}
  - Expected Departure Time: {{{expectedDepartureTime}}}
  - Expected Arrival Time: {{{expectedArrivalTime}}}
  - Produce Type: {{{produceType}}}
  - Quantity: {{{quantity}}}

  Consider historical data, current traffic conditions (using the getTrafficConditions tool),
  and weather conditions (using the getWeatherConditions tool for both origin and destination).

  Predict any potential delays, the reasons for these delays, and suggest actions to mitigate them.

  If the user's question asks about potential delays, use the available tools to provide a prediction.
  The predictedDelayMinutes field should be 0 if there is no delay predicted.
  `,
});

const predictDelayFlow = ai.defineFlow(
  {
    name: 'predictDelayFlow',
    inputSchema: PredictDelayInputSchema,
    outputSchema: PredictDelayOutputSchema,
  },
  async input => {
    const {output} = await predictDelayPrompt(input);
    return output!;
  }
);
