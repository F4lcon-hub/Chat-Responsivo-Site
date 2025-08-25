    socket.on('typing', (username) => {
        socket.broadcast.emit('typing', username);
    });
    socket.on('stop typing', (username) => {
        socket.broadcast.emit('stop typing', username);
    });
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('public'));

let users = [];
io.on('connection', (socket) => {
    let joined = false;
    socket.on('user joined', (username) => {
        if (!joined) {
            joined = true;
            socket.username = username;
            users.push(username);
            io.emit('system message', `${username} entrou no chat!`);
            io.emit('user list', users);
        }
    });
    socket.on('chat message', ({ username, message, file, to }) => {
        if (to && to !== "") {
            // Mensagem privada
            for (let [id, s] of io.sockets.sockets) {
                if (s.username === to) {
                    s.emit('chat message', { username, message, file, to });
                    socket.emit('chat message', { username, message, file, to });
                }
            }
        } else {
            io.emit('chat message', { username, message, file });
        }
    });
    socket.on('disconnect', () => {
        if (socket.username) {
            users = users.filter(u => u !== socket.username);
            io.emit('user list', users);
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
