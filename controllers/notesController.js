const Note = require('../models/Note');
const axios = require('axios');

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.addNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    const newNote = new Note({
      user: req.user.id,
      title,
      content
    });
    const note = await newNote.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateNote = async (req, res) => {
  const { title, content } = req.body;
  try {
    let note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    note.title = title !== undefined ? title : note.title;
    note.content = content !== undefined ? content : note.content;
    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteNote = async (req, res) => {
  try {
    let note = await Note.findOne({ _id: req.params.id, user: req.user.id });
    if (!note) return res.status(404).json({ message: 'Note not found' });

    await Note.deleteOne({ _id: req.params.id });
    res.json({ message: 'Note removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.summarizeNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: 'Note not found' });

    const cohereApiKey = process.env.COHERE_API_KEY;
    if (!cohereApiKey) {
      return res.status(500).json({ message: 'Cohere API key not configured' });
    }

    const response = await axios.post(
      'https://api.cohere.ai/v1/summarize',
      {
        text: note.content,
        length: 'medium', // options: short, medium, long
        format: 'paragraph', // or 'bullets'
        model: 'summarize-xlarge', // current supported summarization model
        temperature: 0.3,
        additional_command: '', // optional, e.g., 'Focus on key points'
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${cohereApiKey}`,
        },
      }
    );

    const summary = response.data.summary?.trim() || '';

    note.summary = summary;
    await note.save();

    res.json({ summary: note.summary });
  } catch (error) {
    console.error('Cohere API Error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to summarize note' });
  }
};

