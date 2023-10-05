const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

server.listen(3000);

app.use(express.static(path.join(__dirname,'public')));

let connectedUsers1 = [];
let connectedUsers2 = [];

io.on('connection', (socket) =>{
    console.log("Conexão detectada...");

    socket.on('join-request', (username, chat) =>{
        socket.username = username;
        socket.chat = chat;
        if(chat === 1){
            connectedUsers1.push(username);
            console.log(connectedUsers1);
            socket.emit('user-ok', connectedUsers1);
            socket.broadcast.to(socket.chat).emit('list-update',{
                joined: username,
                list: connectedUsers1
            })
        }else{
            connectedUsers2.push(username);
            console.log(connectedUsers2);
            socket.emit('user-ok', connectedUsers2);
            socket.broadcast.to(socket.chat).emit('list-update',{
                joined: username,
                list: connectedUsers2
            })
        }

    });
    socket.on('disconnect', () =>{
        if(socket.chat == 1){
            connectedUsers1 = connectedUsers1.filter(u=> u!= socket.username);
            console.log("1 "+connectedUsers1);
    
            socket.broadcast.to(socket.chat).emit('list-update',{
                left: socket.username,
                list: connectedUsers1
            })
        }else{
            connectedUsers2 = connectedUsers1.filter(u=> u!= socket.username);
            console.log("2 "+connectedUsers2);
    
            socket.broadcast.to(socket.chat).emit('list-update',{
                left: socket.username,
                list: connectedUsers2
            })
        }
    });
    socket.on('send-msg', (txt) =>{
        let obj = {
            username: socket.username,
            message: txt
        }
        console.log("teste22: "+socket.chat)
        socket.broadcast.to(socket.chat).emit('show-msg',obj);
    });
});