const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors()); // This allows all origins, which is easiest for now
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Schema
const taskSchema = new mongoose.Schema({
  title: String,
  completed: { type: Boolean, default: false },
  color: String,
  date: String
});

const Task = mongoose.model('Task', taskSchema);

// 2. API Routes
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find().sort({ _id: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Connection (PUT YOUR REAL PASSWORD BELOW)
// Change this line in your backend/index.js
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
  .then(() => console.log('Database Connected! ✅'))
  .catch(err => console.error('Connection Error:', err));

app.listen(5000, () => console.log('🚀 Server running on port 5000'));