import { describe, it, expect } from 'vitest';

describe('OpenAI API key', () => {
  it('should connect to OpenAI and get a response', async () => {
    const apiKey = process.env.OPENAI_API_KEY;
    expect(apiKey).toBeTruthy();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: 'Say "OK" in one word.' }],
        max_tokens: 5,
      }),
    });

    expect(response.ok).toBe(true);
    const data = await response.json() as { choices: { message: { content: string } }[] };
    expect(data.choices[0].message.content).toBeTruthy();
  });
});
