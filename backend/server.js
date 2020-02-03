const express = require("express");
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const cors = require('cors');

const whitelist = ['http://localhost:3000'];
const corsOptions = {
  credentials: true, // This is important.
  origin: (origin, callback) => {
    if(whitelist.includes(origin))
      return callback(null, true)

      callback(new Error('Not allowed by CORS'));
  }
}

const router = require("./routes");
const storageAdapter = require("./storage-adapter");

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

storageAdapter.connect();

const server = app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

const io = socketIo(server);

function broadcastTodos(socket, result) {
  if (socket && !result.error) {
    socket.broadcast.emit('todos were changed', result);
  } else {
    socket.emit('error occured', result);
  }
}

io.on('connection', socket => {
  socket.emit('current storage', storageAdapter.getStorage());

  socket.on('new todo', todo => {
    const result = storageAdapter.addToDo(todo);
    broadcastTodos(socket, result);
  });

  socket.on('cancel todo', todoId => {
    const result = storageAdapter.cancelToDo(todoId);
    broadcastTodos(socket, result);
  });

  socket.on('undo todo', todoId => {
    const result = storageAdapter.undoToDo(todoId);
    broadcastTodos(socket, result);
  });

  socket.on('check todo', todoId => {
    const result = storageAdapter.checkToDo(todoId);
    broadcastTodos(socket, result);
  });

  socket.on('edit todo', ({ id, text }) => {
    const result = storageAdapter.editToDo(id, text);
    broadcastTodos(socket, result);
  });

  socket.on('change order', todos => {
    const result = storageAdapter.changeOrder(todos);
    broadcastTodos(socket, result);
  });

  socket.on('current state', todos => {
    const result = storageAdapter.mergeTodos(todos);
    if (result) {
      io.emit('todos were changed', result);
    }
  });

  socket.on('delete todo', todoId => {
    const result = storageAdapter.deleteToDo(todoId);
    broadcastTodos(socket, result);
  });
});
