const { default: makeWASocket, useMultiFileAuthState } = require('@adiwajshing/baileys');
const { Ollama } = require('ollama');
const { initDB, addMessage, getRecentMessages } = require('./memory/db');
const { getSystemPrompt } = require('./prompt/system');

const AI_NAME = process.env.AI_NAME || 'Flare';
const USER_NAME = process.env.USER_NAME || 'Valerio';
const MAX_MEMORY = parseInt(process.env.MAX_MEMORY, 10) || 10;
const LLM_MODEL = process.env.LLM_MODEL || 'tinyllama';

const ollama = new Ollama({ host: 'http://localhost:11434' });
const db = initDB();

async function main() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message || msg.key.fromMe) return;

        const userMessage = msg.message.conversation || msg.message.extendedTextMessage?.text;
        if (!userMessage) return;

        console.log(`Received message from ${msg.key.remoteJid}: ${userMessage}`);

        try {
            const recentMessages = await getRecentMessages(db, MAX_MEMORY);
            const systemPrompt = getSystemPrompt(AI_NAME, USER_NAME, recentMessages);

            const response = await ollama.chat({
                model: LLM_MODEL,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                stream: false
            });

            const aiResponse = response.message.content;
            await sock.sendMessage(msg.key.remoteJid, { text: aiResponse });
            console.log(`Sent response to ${msg.key.remoteJid}: ${aiResponse}`);

            addMessage(db, msg.key.remoteJid, userMessage, aiResponse);
        } catch (error) {
            console.error('Error processing message:', error);
        }
    });
}

main().catch(console.error);
