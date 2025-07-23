const Database = require('better-sqlite3');

function initDB() {
    const db = new Database('flare.db', { verbose: console.log });
    db.exec(`
        CREATE TABLE IF NOT EXISTS memories (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT NOT NULL,
            user_message TEXT NOT NULL,
            ai_response TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);
    return db;
}

function addMessage(db, userId, userMessage, aiResponse) {
    const stmt = db.prepare('INSERT INTO memories (user_id, user_message, ai_response) VALUES (?, ?, ?)');
    stmt.run(userId, userMessage, aiResponse);
}

async function getRecentMessages(db, limit) {
    const stmt = db.prepare('SELECT user_message, ai_response, timestamp FROM memories ORDER BY timestamp DESC LIMIT ?');
    return stmt.all(limit);
}

module.exports = { initDB, addMessage, getRecentMessages };
