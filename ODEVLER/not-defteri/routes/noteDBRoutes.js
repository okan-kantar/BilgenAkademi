const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteDBController');

router.get('/', noteController.getAllNotes);
router.get('/:noteId', noteController.getNoteById);
router.post('/', noteController.createNewNote);
router.put('/', noteController.updateNote);
router.delete('/:noteId', noteController.deleteNote);


module.exports = router;

