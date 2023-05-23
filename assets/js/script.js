const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dbFilePath = path.join(__dirname, 'db.json');

function readNotesFromFile() {
  return new Promise((resolve, reject) => {
    fs.readFile(dbFilePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const notes = JSON.parse(data);
          resolve(notes);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}

function writeNotesToFile(notes) {
  return new Promise((resolve, reject) => {
    fs.writeFile(dbFilePath, JSON.stringify(notes), 'utf8', (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save-note');

  saveButton.addEventListener('click', () => {
    const titleInput = document.getElementById('note-title');
    const textInput = document.getElementById('note-text');

    const title = titleInput.value;
    const text = textInput.value;

    if (title && text) {
      readNotesFromFile()
        .then((notes) => {
          const newNote = {
            id: uuidv4(),
            title,
            text,
          };

          notes.push(newNote);

          writeNotesToFile(notes)
            .then(() => {
              console.log('Note saved:', newNote);

              titleInput.value = '';
              textInput.value = '';
            })
            .catch((error) => {
              console.error('Unable to save notes:', error);
            });
        })
        .catch((error) => {
          console.error('Unable to read notes:', error);
        });
    }
  });
});
