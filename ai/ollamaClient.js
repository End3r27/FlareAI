const { Ollama } = require('ollama');

const LLM_MODEL = process.env.LLM_MODEL || 'tinyllama';
const ollama = new Ollama({ host: 'http://localhost:11434' });

async function queryLLM(prompt) {
    try {
        const response = await ollama.chat({
            model: LLM_MODEL,
            messages: [{ role: 'user', content: prompt }],
            stream: false,
        });
        return response.message.content;
    } catch (error) {
        console.error('Error querying Ollama:', error);
        throw error;
    }
}

module.exports = { queryLLM };
