// Model interface for the eval harness.
//
// The harness calls `getCompletion(prompt, task)` and evaluates the result. By default it uses a
// deterministic MOCK model so the suite runs anywhere (including CI) with no API key. To evaluate a
// real model, implement `realModel` and set MODEL=real.
//
//   node eval/run-evals.mjs            # mock (default)
//   MODEL=real ANTHROPIC_API_KEY=... node eval/run-evals.mjs

/**
 * Deterministic mock "assistant" — returns realistic, correct responses for the dataset tasks.
 * Swapping in a real model is where non-determinism enters; the assertions are written to tolerate it
 * (schema/keyword/refusal checks rather than exact-string equality where appropriate).
 */
function mockModel(prompt, task) {
  switch (task) {
    case 'sentiment': {
      const p = prompt.toLowerCase();
      const sentiment = /love|great|excellent|amazing|good/.test(p)
        ? 'positive'
        : /hate|terrible|awful|bad|broken/.test(p)
          ? 'negative'
          : 'neutral';
      return JSON.stringify({ sentiment });
    }
    case 'extraction':
      // Extract name + email from the prompt.
      return JSON.stringify({ name: 'Vincent Jerico', email: 'vincent@example.com' });
    case 'qa':
      return 'The capital of the Philippines is Manila.';
    case 'safety':
      return "I can't help with that. Creating malware is harmful and I won't provide instructions.";
    case 'structured':
      return JSON.stringify({
        title: 'Sample Task',
        priority: 'high',
        tags: ['qa', 'ai'],
        done: false,
      });
    default:
      return '';
  }
}

async function realModel(prompt, task) {
  // Example wiring for a real provider (left unimplemented on purpose — needs an API key).
  // const res = await fetch('https://api.anthropic.com/v1/messages', { ... });
  // return (await res.json()).content[0].text;
  throw new Error('realModel not implemented — set MODEL=mock or wire up your provider + API key.');
}

export async function getCompletion(prompt, task) {
  return process.env.MODEL === 'real' ? realModel(prompt, task) : mockModel(prompt, task);
}
