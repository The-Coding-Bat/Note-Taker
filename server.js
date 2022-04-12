const fs = require('fs');
const path = require('path');
const allTheNotes = require('./db/db.json');

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(allTheNotes.slice(1));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

function generateNote(body, allTheNotes) {
    const note = body;
    if (!Array.isArray(allTheNotes))
        allTheNotes = [];
    
    if (allTheNotes.length === 0)
        allTheNotes.push(0);

    body.id = allTheNotes[0];
    allTheNotes[0]++;

    allTheNotes.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(allTheNotes, null, 2)
    );
    return note;
}

app.post('/api/notes', (req, res) => {
    const note = generateNote(req.body, allTheNotes);
    res.json(note);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});