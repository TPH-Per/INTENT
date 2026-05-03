import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function callLLM(systemPrompt: string, userContent: string): Promise<string> {
  const response = await client.messages.create({
    model: 'claude-3-5-sonnet-20240620', // Using current stable model
    max_tokens: 2048,
    system: systemPrompt,
    messages: [{ role: 'user', content: userContent }],
  });

  const block = response.content.find(b => b.type === 'text');
  if (!block || block.type !== 'text') {
    throw new Error('No text response from LLM');
  }

  return block.text;
}
