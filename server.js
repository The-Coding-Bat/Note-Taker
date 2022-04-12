const fs = require('fs');
const path = require('path');
const completeNotes = require('./db/db.json');

const express = require('express');
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/api/notes', (req, res) => {
    res.json(completeNotes.slice(1));
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

function generateNote(body, notesArray) {
    const note = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(note);
    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return note;
}

app.delete("/api/notes/:id", function(req, res){
        
    // Obtains id and converts to a string
    let id = req.params.id.toString();

    // Goes through notesArray searching for matching ID
    for (i=0; i < completeNotes.length; i++){
       
        if (completeNotes[i].id == id){
            // responds with deleted note
            res.send(completeNotes[i]);

            // Removes the deleted note
            completeNotes.splice(i,1);
            break;
        }
    }
});

app.post('/api/notes', (req, res) => {
    const note = generateNote(req.body, completeNotes);
    res.json(note);
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});