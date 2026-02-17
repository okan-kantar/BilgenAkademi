const fs = require("fs");
const path = require("path");

const notesFilePath = path.join(__dirname, "..", "models", "notes.json");

const readNotes = () => {
  const jsonData = fs.readFileSync(notesFilePath);
  return JSON.parse(jsonData);
};

const writeData = (notes) => {
  fs.writeFileSync(notesFilePath, JSON.stringify(notes, null, 2));
};

const getAllNotes = (req, res) => {
  const notes = readNotes();
  res.status(200).json(notes);
};

const getNoteById = (req, res) => {
  const { noteId } = req.params;
  const notes = readNotes();
  const findNote = notes.find((n) => n.id == Number(noteId));
  if (findNote) {
    res.status(200).json(findNote);
  } else {
    res.status(404).json({ message: "Not bulunamadı!" });
  }
};

const createNewNote = (req, res) => {
  const { newNote } = req.body;
  const notes = readNotes();
  const newId = notes.length ? notes[notes.length - 1].id + 1 : 1;
  const note = { id: newId, ...newNote };
  notes.push(note);
  writeData(notes);
  res.status(201).json(note);
};

const updateNote = (req, res) => {
  const { id: noteId, title, content } = req.body;
  let notes = readNotes();
  const findNote = notes.find((n) => n.id === noteId);

  if (findNote) {
    notes = notes.map((note) => {
      if (note.id === findNote.id) {
        return { ...note, title, content };
      }
      return note;
    });
    writeData(notes);
    res.status(200).json({ success: true, notes });
  } else {
    res.status(404).json({ message: "Not bulunamadı!" });
  }
};

const deleteNote = (req, res) => {
  const { noteId } = req.params;
  let notes = readNotes();
  const findNote = notes.find((n) => n.id === Number(noteId));
  if (findNote) {
    notes = notes.filter((n) => n.id !== findNote.id);
    writeData(notes);
    res.status(200).json({ success: true, notes });
  } else {
    res.status(404).json({ message: "Not bulunamadı!" });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNewNote,
  updateNote,
  deleteNote,
};
