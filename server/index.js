const http = require('http');
const express = require('express');
const cors = require('cors');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./user');

const router = require('./router');

const app = express();

const server = http.createServer(app);
const io = require('socket.io')(server, {
  cors: {
   origin: ['http://localhost:3000'],
   },
 });

app.use(cors());
app.use(router);


io.on('connection', socket => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    console.log('the message received by server ', message,
    'the socket id is' , socket.id,
    'user name is ', user.name);
    // console.log('the user is ',user, 'the socket id is ', socket.id, 'the socket is ', socket);
    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));