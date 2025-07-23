const { getRecentMessages } = require('./db');

function formatMemory(memory) {
    const date = new Date(memory.timestamp).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    });
    return `- On ${date}, ${process.env.USER_NAME} said: "${memory.user_message}". You replied: "${memory.ai_response}"`;
}

async function getMemoryInjection(db) {
    const memories = await getRecentMessages(db, process.env.MAX_MEMORY || 10);
    if (memories.length === 0) {
        return '';
    }

    const formattedMemories = memories.map(formatMemory).join('\n');
    return `You remember:\n${formattedMemories}`;
}

module.exports = { getMemoryInjection };
