// notificationController.js

const User = require('./userModel');
const Task = require('./taskModel');

// Function to send notification
const sendNotification = (user, message) => {
  // Here you can implement the logic to send the notification
  // It can be an email, SMS, push notification, etc.
  // This is just a placeholder function
  console.log(`Notification sent to ${user.email}: ${message}`);
};

// Function to create a notification when a task is assigned
exports.notifyTaskAssignment = async (taskId) => {
  try {
    const task = await Task.findById(taskId).populate('assignee');
    const message = `You have been assigned a new task: ${task.title}`;
    sendNotification(task.assignee, message);
  } catch (err) {
    console.error(err);
  }
};

// Function to create a notification when a task is updated
exports.notifyTaskUpdate = async (taskId) => {
  try {
    const task = await Task.findById(taskId).populate('assignee');
    const message = `A task you are assigned to has been updated: ${task.title}`;
    sendNotification(task.assignee, message);
  } catch (err) {
    console.error(err);
  }
};

// Function to create a notification when a task is due
exports.notifyTaskDue = async (taskId) => {
  try {
    const task = await Task.findById(taskId).populate('assignee');
    const message = `A task you are assigned to is due: ${task.title}`;
    sendNotification(task.assignee, message);
  } catch (err) {
    console.error(err);
  }
};

// Function to update user's notification preferences
exports.updateNotificationPreferences = async (userId, preferences) => {
  try {
    const user = await User.findById(userId);
    user.setNotificationPreferences(preferences);
    await user.save();
  } catch (err) {
    console.error(err);
  }
};
