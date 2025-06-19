'use server';

/**
 * @fileOverview AI-driven generation of Hogwarts house facts.
 *
 * - generateHouseFacts - A function that generates facts about a specific Hogwarts house.
 * - GenerateHouseFactsInput - The input type for the generateHouseFacts function.
 * - GenerateHouseFactsOutput - The return type for the generateHouseFacts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHouseFactsInputSchema = z.object({
  house: z
    .enum(['Gryffindor', 'Ravenclaw', 'Hufflepuff', 'Slytherin'])
    .describe('The Hogwarts house for which to generate facts.'),
});
export type GenerateHouseFactsInput = z.infer<typeof GenerateHouseFactsInputSchema>;

const GenerateHouseFactsOutputSchema = z.object({
  fact: z.string().describe('An interesting fact about the specified Hogwarts house.'),
});
export type GenerateHouseFactsOutput = z.infer<typeof GenerateHouseFactsOutputSchema>;

export async function generateHouseFacts(input: GenerateHouseFactsInput): Promise<GenerateHouseFactsOutput> {
  return generateHouseFactsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateHouseFactsPrompt',
  input: {schema: GenerateHouseFactsInputSchema},
  output: {schema: GenerateHouseFactsOutputSchema},
  prompt: `You are a knowledgeable guide to Hogwarts School of Witchcraft and Wizardry.
  A student has just been sorted into {{house}}, provide them with one interesting fact about their new house.
  The fact should be no more than two sentences long.
  The output should be a single string.`,
});

const generateHouseFactsFlow = ai.defineFlow(
  {
    name: 'generateHouseFactsFlow',
    inputSchema: GenerateHouseFactsInputSchema,
    outputSchema: GenerateHouseFactsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
