const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Serve static files
app.use(express.static('public'));

// API routes
app.get('/api/notes', (req, res) => {
  const notes = getNotes();
  res.json(notes);
});

app.post('/api/notes', (req, res) => {
  const newNote = req.body;
  saveNote(newNote);
  res.sendStatus(200);
});

// Helper functions
function getNotes() {
  const dbFilePath = path.join(__dirname, 'db.json');
  if (!fs.existsSync(dbFilePath)) {
    return [];
  }
  const dbData = fs.readFileSync(dbFilePath, 'utf-8');
  return JSON.parse(dbData);
}

function saveNote(note) {
  const notes = getNotes();
  notes.push(note);
  const dbFilePath = path.join(__dirname, 'db.json');
  fs.writeFileSync(dbFilePath, JSON.stringify(notes));
}

// Route for the index page ("/index" or "/index.html")
app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Route for the root URL ("/")
app.get('/', (req, res) => {
  res.redirect('/index');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
