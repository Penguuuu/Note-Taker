const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const dbFilePath = path.join(__dirname, 'db.json');

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/api/notes', (req, res) => {
  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes:', err);
      res.status(500).json({ error: 'Unable to fetch notes' });
    } else {
      try {
        const notes = JSON.parse(data);
        res.json(notes);
      } catch (error) {
        console.error('Error parsing notes:', error);
        res.status(500).json({ error: 'Unable to fetch notes' });
      }
    }
  });
});

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    res.status(400).json({ error: 'Invalid data' });
    return;
  }

  fs.readFile(dbFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading notes:', err);
      res.status(500).json({ error: 'Failed to save note' });
    } else {
      try {
        const notes = JSON.parse(data);
        const newNote = { id: uuidv4(), title, text };
        notes.push(newNote);

        fs.writeFile(dbFilePath, JSON.stringify(notes), 'utf8', (err) => {
          if (err) {
            console.error('Error writing notes:', err);
            res.status(500).json({ error: 'Failed to save note' });
          } else {
            res.json(newNote);
          }
        });
      } catch (error) {
        console.error('Error parsing notes:', error);
        res.status(500).json({ error: 'Failed to save note' });
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
