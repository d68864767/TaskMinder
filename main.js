// main.js

const socket = io.connect('http://localhost:3000');

// DOM Elements
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const assigneeInput = document.getElementById('assignee-input');
const deadlineInput = document.getElementById('deadline-input');

// Event Listeners
taskForm.addEventListener('submit', createTask);

// Create a new task
function createTask(e) {
  e.preventDefault();
  socket.emit('createTask', {
    title: taskInput.value,
    assignee: assigneeInput.value,
    deadline: deadlineInput.value
  });
  taskInput.value = '';
  assigneeInput.value = '';
  deadlineInput.value = '';
}

// Listen for tasks from server
socket.on('newTask', function(task) {
  const li = document.createElement('li');
  li.textContent = `${task.title} - Assigned to: ${task.assignee} - Deadline: ${task.deadline}`;
  taskList.appendChild(li);
});

// Listen for task updates from server
socket.on('updateTask', function(task) {
  // Find the task in the task list and update its content
  const taskItems = Array.from(taskList.getElementsByTagName('li'));
  const taskItem = taskItems.find(item => item.textContent.includes(task.title));
  if (taskItem) {
    taskItem.textContent = `${task.title} - Assigned to: ${task.assignee} - Deadline: ${task.deadline} - Status: ${task.status}`;
  }
});

// Listen for task deletions from server
socket.on('deleteTask', function(task) {
  // Find the task in the task list and remove it
  const taskItems = Array.from(taskList.getElementsByTagName('li'));
  const taskItem = taskItems.find(item => item.textContent.includes(task.title));
  if (taskItem) {
    taskList.removeChild(taskItem);
  }
});
