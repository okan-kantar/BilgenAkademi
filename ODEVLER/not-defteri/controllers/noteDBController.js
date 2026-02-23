const Note = require('../models/note.js');

const getAllNotes = async (req, res) => {
    try {
        const notes = await Note.find();
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Notlar alınamadı!", error });
    }
};

const getNoteById = async (req, res) => {
  const { noteId } = req.params;
  try {
    const note = await Note.findById(noteId);
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({ message: "Not bulunamadı!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Not alınamadı!", error });
  }
};

const createNewNote = async (req, res) => {
  try {
    const note = await Note.create(req.body);
    res.status(201).json(note);
  } catch (error) {
    res.status(500).json({ message: "Not oluşturulamadı!", error });
  }
};

const updateNote = async (req, res) => {
  const { id: noteId, title, content } = req.body;

  try {
    const note = await Note.findByIdAndUpdate(
      noteId,
      { title, content },
      { new: true }
    );
    if (note) {
      res.status(200).json(note);
    } else {
      res.status(404).json({ message: "Not bulunamadı!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Not güncellenemedi!", error });
  }
};

const deleteNote = async (req, res) => {
  const { noteId } = req.params;
  try {
    const note = await Note.findByIdAndDelete(noteId);
    if (note) {
      res.status(200).json({ message: "Not silindi!" });
    } else {
      res.status(404).json({ message: "Not bulunamadı!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Not silinemedi!", error });
  }
};

module.exports = {
  getAllNotes,
  getNoteById,
  createNewNote,
  updateNote,
  deleteNote,
};