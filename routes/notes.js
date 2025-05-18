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

router.get('/',auth , getNotes);
router.post('/',auth , addNote);
router.put('/:id',auth , updateNote);
router.delete('/:id',auth , deleteNote);
router.post('/:id/summarize',auth , summarizeNote);

module.exports = router;
