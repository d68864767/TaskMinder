const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const TaskMinder = require('TaskMinder');
const authController = require('./authController');
const taskController = require('./taskController');
const notificationController = require('./notificationController');
const realTimeController = require('./realTimeController');
const config = require('./config');

const app = express();
const server = require('http').createServer(app);
const io = socketio(server);

mongoose.connect(config.dbUrl, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connected successfully'))
  .catch(err => console.log('Database connection error: ', err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/auth', authController);
app.use('/tasks', taskController);
app.use('/notifications', notificationController);

io.on('connection', realTimeController);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

server.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});
