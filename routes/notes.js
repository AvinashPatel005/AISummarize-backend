const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getNotes,
  addNote,
  updateNote,
  deleteNote,
  summarizeNote
} = require('../controllers/notesController');

router.use(auth);

router.get('/', getNotes);
router.post('/', addNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);
router.post('/:id/summarize', summarizeNote);

module.exports = router;
