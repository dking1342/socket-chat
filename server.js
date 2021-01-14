const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const {formatMessage} = require('./utils/formatMessages');
const { users, userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');


// init 
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// creates static folder
app.use(express.static(`${__dirname}/public`));

const bot = 'Kavooce Bot';

// init when client connects
io.on('connection',socket=>{
    // joining a room
    socket.on('joinRoom',({username,room})=>{
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        // welcome to the client
        socket.emit('chat',formatMessage(bot,'Welcome to Kavooce Chat'));

        // broadcast when client joins chat
        socket.broadcast
            .to(user.room)
            .emit(
                'chat',
                formatMessage(bot,`${user.username} has joined the chat`)
            );

        // send users and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users:getRoomUsers(user.room)
        })
    })

    // listen for chat msg
    socket.on('chatMsg',(msg)=>{
        const user = getCurrentUser(socket.id);

        if(user){
            io.to(user.room).emit('chat',formatMessage(user.username,msg));
        }
    })
    
    // broadcast when client leaves chat
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);

        io.to(user.room).emit('chat',formatMessage(bot,`${user.username} has left the chat`));

        // send users and room info
        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users:getRoomUsers(user.room)
        })
    });
})


const PORT = 3000 || process.env.PORT;
server.listen(PORT, ()=> console.log(`Server listening on port ${PORT}`))