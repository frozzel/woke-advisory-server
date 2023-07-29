const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const socketio = require('socket.io');

const app = express();
const server = require('http').Server(app);
const io = socketio(server);

dotenv.config();
const port = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB connection established successfully');
});

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
const messagesRouter = require('./routes/messages');
app.use('/messages', messagesRouter);

// Start server
server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Socket.IO
io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on('sendMessage', (message) => {
    io.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (name && message) {
      socket.emit('sendMessage', { name, message });
      setName('');
      setMessage('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} placeholder="Your name" onChange={(event) => setName(event.target.value)} />
        <input type="text" value={message} placeholder="Your message" onChange={(event) => setMessage(event.target.value)} />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>
            {message.name}: {message.message}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;