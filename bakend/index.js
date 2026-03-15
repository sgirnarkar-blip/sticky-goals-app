const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// 1. CREATE 'app' FIRST
const app = express(); 

// 2. NOW you can use app.use
app.use(cors());
app.use(express.json());

// 3. Setup your MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Database Connected! ✅"))
  .catch(err => console.log("MongoDB Error: ", err));

// 4. Define your Schema and Routes
const taskSchema = new mongoose.Schema({
  title: String,
  completed: Boolean,
  color: String,
  date: String
});
const Task = mongoose.model('Task', taskSchema);

app.get('/tasks', async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post('/tasks', async (req, res) => {
  const newTask = new Task(req.body);
  await newTask.save();
  res.json(newTask);
});

// 5. Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));