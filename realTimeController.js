// realTimeController.js

const socketio = require('socket.io');
const Task = require('./taskModel');
const User = require('./userModel');

module.exports = function(socket) {
  console.log('A user connected: ' + socket.id);

  // Listen for a new task
  socket.on('newTask', async (taskData) => {
    try {
      const task = new Task(taskData);
      const savedTask = await task.save();
      socket.broadcast.emit('taskCreated', savedTask);
    } catch (err) {
      console.error(err);
    }
  });

  // Listen for task updates
  socket.on('updateTask', async (taskData) => {
    try {
      const task = await Task.findByIdAndUpdate(taskData.id, taskData, { new: true });
      socket.broadcast.emit('taskUpdated', task);
    } catch (err) {
      console.error(err);
    }
  });

  // Listen for task deletions
  socket.on('deleteTask', async (taskId) => {
    try {
      await Task.findByIdAndRemove(taskId);
      socket.broadcast.emit('taskDeleted', taskId);
    } catch (err) {
      console.error(err);
    }
  });

  // Listen for new comments
  socket.on('newComment', async (commentData) => {
    try {
      const task = await Task.findById(commentData.taskId);
      task.comments.push(commentData.comment);
      const updatedTask = await task.save();
      socket.broadcast.emit('commentAdded', updatedTask);
    } catch (err) {
      console.error(err);
    }
  });

  // Listen for user disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected: ' + socket.id);
  });
};
