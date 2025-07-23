const fs = require('fs');
const path = require('path');
const { getMemoryInjection } = require('../memory/memoryManager');

function getSystemPrompt(aiName, userName, db) {
    const template = fs.readFileSync(path.join(__dirname, 'system.txt'), 'utf-8');
    const memory = getMemoryInjection(db);

    return template
        .replace('{AI_NAME}', aiName)
        .replace('{USER_NAME}', userName)
        .replace('{MEMORY}', memory);
}

module.exports = { getSystemPrompt };
