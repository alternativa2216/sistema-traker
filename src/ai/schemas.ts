import {z} from 'zod';

// --- analyze-ad-creative.ts ---
export const AnalyzeAdCreativeInputSchema = z.object({
  imageDataUri: z.string().describe("A imagem do anúncio, como um data URI que deve incluir um MIME type e usar Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."),
});
export type AnalyzeAdCreativeInput = z.infer<typeof AnalyzeAdCreativeInputSchema>;

export const AnalyzeAdCreativeOutputSchema = z.object({
  score: z.number().min(0).max(100).describe('Uma pontuação de 0 a 100 para a eficácia geral do criativo.'),
  feedback: z.string().describe('Um feedback geral sobre os pontos fortes e fracos da imagem.'),
  suggestions: z.array(z.string()).describe('Uma lista de sugestões acionáveis para melhorar o criativo.'),
});
export type AnalyzeAdCreativeOutput = z.infer<typeof AnalyzeAdCreativeOutputSchema>;


// --- analyze-project-data.ts ---
export const AnalyzeProjectDataInputSchema = z.object({
  projectId: z.string().describe('O ID do projeto a ser analisado.'),
  query: z.string().describe('A pergunta específica ou solicitação de análise do usuário.'),
  data: z.string().optional().describe('Os dados JSON relacionados ao projeto'),
});
export type AnalyzeProjectDataInput = z.infer<typeof AnalyzeProjectDataInputSchema>;

export const AnalyzeProjectDataOutputSchema = z.object({
  analysis: z.string().describe('A análise gerada por IA dos dados do projeto com base na consulta do usuário.'),
});
export type AnalyzeProjectDataOutput = z.infer<typeof AnalyzeProjectDataOutputSchema>;


// --- generate-ab-test-hypothesis.ts ---
export const GenerateAbTestHypothesisInputSchema = z.object({
  pageUrl: z.string().describe('A URL ou caminho da página a ser otimizada (ex: /precos).'),
  optimizationGoal: z.string().describe('O objetivo principal da otimização (ex: Aumentar cliques no botão de compra, reduzir a taxa de rejeição).'),
});
export type GenerateAbTestHypothesisInput = z.infer<typeof GenerateAbTestHypothesisInputSchema>;

const HypothesisSchema = z.object({
    hypothesis: z.string().describe("A hipótese do teste. Ex: 'Alterar o texto do botão de 'Começar' para 'Começar Gratuitamente' irá aumentar a taxa de cliques.'"),
    suggestion: z.string().describe("A sugestão de implementação. Ex: 'Variante A: 'Começar'. Variante B: 'Começar Gratuitamente'.'"),
});
export type Hypothesis = z.infer<typeof HypothesisSchema>;


export const GenerateAbTestHypothesisOutputSchema = z.object({
  hypotheses: z.array(HypothesisSchema).describe('Uma lista de 3 a 5 hipóteses de teste A/B acionáveis.'),
});
export type GenerateAbTestHypothesisOutput = z.infer<typeof GenerateAbTestHypothesisOutputSchema>;


// --- generate-ad-copy.ts ---
export const GenerateAdCopyInputSchema = z.object({
  productDescription: z.string().describe('Uma descrição detalhada do produto ou serviço a ser anunciado.'),
});
export type GenerateAdCopyInput = z.infer<typeof GenerateAdCopyInputSchema>;

export const GenerateAdCopyOutputSchema = z.object({
  headline: z.string().describe('Um título curto e impactante para o anúncio (máximo 40 caracteres).'),
  primaryText: z.string().describe('O corpo principal do anúncio, persuasivo e informativo (máximo 125 caracteres).'),
  cta: z.string().describe('Uma chamada para ação clara e concisa (ex: "Compre Agora", "Saiba Mais").'),
});
export type GenerateAdCopyOutput = z.infer<typeof GenerateAdCopyOutputSchema>;


// --- generate-swot-analysis.ts ---
export const GenerateSwotAnalysisInputSchema = z.object({
  projectData: z
    .string()
    .describe('Os dados coletados para o projeto a ser analisado.'),
});
export type GenerateSwotAnalysisInput = z.infer<typeof GenerateSwotAnalysisInputSchema>;

export const GenerateSwotAnalysisOutputSchema = z.object({
  strengths: z.string().describe('As forças do projeto.'),
  weaknesses: z.string().describe('As fraquezas do projeto.'),
  opportunities: z.string().describe('As oportunidades para o projeto.'),
  threats: z.string().describe('As ameaças ao projeto.'),
});
export type GenerateSwotAnalysisOutput = z.infer<typeof GenerateSwotAnalysisOutputSchema>;


// --- suggest-ad-audience.ts ---
export const SuggestAdAudienceInputSchema = z.object({
  customerProfile: z.string().describe('Uma descrição do cliente ideal, incluindo seus desejos, dores e dados demográficos.'),
});
export type SuggestAdAudienceInput = z.infer<typeof SuggestAdAudienceInputSchema>;

export const SuggestAdAudienceOutputSchema = z.object({
  interests: z.array(z.string()).describe('Uma lista de interesses detalhados que este público provavelmente tem no Facebook.'),
  behaviors: z.array(z.string()).describe('Uma lista de comportamentos de compra ou online que podem ser usados para segmentação.'),
  demographics: z.string().describe('Um resumo dos dados demográficos do público (idade, gênero, localização, etc.).'),
});
export type SuggestAdAudienceOutput = z.infer<typeof SuggestAdAudienceOutputSchema>;