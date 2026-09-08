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

const HOUSE_LORE_FALLBACKS: Record<string, string[]> = {
  Gryffindor: [
    'グリフィンドールの剣は、真の勇気を示したグリフィンドール生にのみ、組分け帽子の中から現れるとされています。',
    '談話室の入り口を守る「太った婦人」は、合言葉を忘れた生徒を絶対に中に入れない厳格さを持っています。',
    '創設者ゴドリック・グリフィンドールはゴドリックの谷の出身であり、その大胆さと決闘の腕前は伝説となっています。',
  ],
  Ravenclaw: [
    'レイブンクローの塔に入るには合言葉ではなく、青銅の鷲のドアノッカーが出す知恵のなぞなぞを解く必要があります。',
    '談話室の天井にはドーム状の夜空が描かれ、創設者ロウェナ・レイブンクローの美しき大理石像が静かに見守っています。',
    'レイブンクロー生は独自の視点を尊重し、風変わりであっても知的な好奇心を何よりも誇りにしています。',
  ],
  Hufflepuff: [
    'ハッフルパフの談話室は厨房の隣にあり、全寮の中で唯一、他寮生に侵入された記録が一度もありません。',
    '樽の蓋を「ヘルガ・ハッフルパフ」のリズムで正しく叩かないと、侵入者撃退用の酢を吹きかけられます。',
    'ハッフルパフは歴史上最も闇の魔法使いを輩出しなかった寮であり、仲間への真の忠誠と勤勉さを讃えています。',
  ],
  Slytherin: [
    'スリザリンの談話室は黒い湖の真下に位置し、緑色の窓越しに巨大イカや水中生物が通り過ぎる幻想的な場所です。',
    'かの偉大な大魔法使いマーリンもスリザリンの出身であり、魔法界最高峰の勲章にはスリザリンの緑のリボンが使われています。',
    'スリザリン生は高い志と狡猾な機知を持ち、自らの仲間と誓った目的のためならあらゆる困難を切り拓きます。',
  ],
};

export async function generateHouseFacts(input: GenerateHouseFactsInput): Promise<GenerateHouseFactsOutput> {
  try {
    const result = await generateHouseFactsFlow(input);
    if (result && result.fact) {
      return result;
    }
  } catch (error) {
    console.warn('AI fact generation via Genkit fell back to curated lore:', error);
  }

  // Graceful fallback to curated facts
  const fallbacks = HOUSE_LORE_FALLBACKS[input.house] || HOUSE_LORE_FALLBACKS.Gryffindor;
  const randomFact = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  return { fact: randomFact };
}

const prompt = ai.definePrompt({
  name: 'generateHouseFactsPrompt',
  input: {schema: GenerateHouseFactsInputSchema},
  output: {schema: GenerateHouseFactsOutputSchema},
  prompt: `あなたはホグワーツ魔法魔術学校の博識な案内人です。
新入生が【{{house}}】寮に組分けされました。
新入生を祝福し、その寮にまつわる興味深い魔法の豆知識（トリビアや歴史、談話室の秘密など）を日本語で1つ伝えてください。
文章は親しみやすく魅力的で、2文以内で簡潔にまとめてください。
出力はfactフィールドの文字列のみにしてください。`,
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
