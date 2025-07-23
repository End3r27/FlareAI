const express = require('express');
const { initDB } = require('./db');

const app = express();
const port = 3000;
const db = initDB();

app.get('/', (req, res) => {
    const memories = db.prepare('SELECT * FROM memories ORDER BY timestamp DESC').all();
    res.send(`
        <style>
            body { font-family: sans-serif; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
        </style>
        <h1>Flare Memory Viewer</h1>
        <table>
            <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>User Message</th>
                <th>AI Response</th>
                <th>Timestamp</th>
            </tr>
            ${memories.map(m => `
                <tr>
                    <td>${m.id}</td>
                    <td>${m.user_id}</td>
                    <td>${m.user_message}</td>
                    <td>${m.ai_response}</td>
                    <td>${m.timestamp}</td>
                </tr>
            `).join('')}
        </table>
    `);
});

app.listen(port, () => {
    console.log(`Memory viewer listening at http://localhost:${port}`);
});
