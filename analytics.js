// analytics.js

const mongoose = require('mongoose');
const Task = require('./taskModel');
const User = require('./userModel');

// Function to calculate task completion rates
async function calculateTaskCompletionRates() {
  const totalTasks = await Task.countDocuments();
  const completedTasks = await Task.countDocuments({ status: 'completed' });
  const completionRate = (completedTasks / totalTasks) * 100;
  return completionRate.toFixed(2);
}

// Function to calculate user productivity
async function calculateUserProductivity(userId) {
  const userTasks = await Task.countDocuments({ assignee: userId });
  const userCompletedTasks = await Task.countDocuments({ assignee: userId, status: 'completed' });
  const userProductivity = (userCompletedTasks / userTasks) * 100;
  return userProductivity.toFixed(2);
}

// Function to calculate team performance
async function calculateTeamPerformance() {
  const users = await User.find();
  let teamPerformance = 0;

  for (let user of users) {
    const userProductivity = await calculateUserProductivity(user._id);
    teamPerformance += Number(userProductivity);
  }

  teamPerformance = teamPerformance / users.length;
  return teamPerformance.toFixed(2);
}

// Function to generate reports
async function generateReports() {
  const taskCompletionRate = await calculateTaskCompletionRates();
  const teamPerformance = await calculateTeamPerformance();

  const report = {
    taskCompletionRate,
    teamPerformance
  };

  return report;
}

module.exports = {
  calculateTaskCompletionRates,
  calculateUserProductivity,
  calculateTeamPerformance,
  generateReports
};
