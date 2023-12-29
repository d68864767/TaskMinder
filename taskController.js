// taskController.js

const Task = require('./taskModel');
const User = require('./userModel');

// Create a new task
exports.createTask = async (req, res) => {
  try {
    const task = new Task(req.body);
    const savedTask = await task.save();
    res.json(savedTask);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Get a task by id
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).send('No task found');
    res.json(task);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedTask) return res.status(404).send('No task found');
    res.json(updatedTask);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndRemove(req.params.id);
    if (!deletedTask) return res.status(404).send('No task found');
    res.json(deletedTask);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Assign a task to a user
exports.assignTask = async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const task = await Task.findById(req.body.taskId);
    if (!user || !task) return res.status(404).send('User or task not found');
    task.assignee = user._id;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).send(err);
  }
};

// Add a comment to a task
exports.addComment = async (req, res) => {
  try {
    const task = await Task.findById(req.body.taskId);
    if (!task) return res.status(404).send('Task not found');
    task.comments.push({
      author: req.body.authorId,
      text: req.body.text
    });
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).send(err);
  }
};
