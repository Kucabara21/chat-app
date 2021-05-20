const express = require('express')
const socket = require('socket.io')
const app = express();
const formatMessages = require('./messages')
const {userJoins, getUserRoom, userLeaves} = require('./users')

app.use(express.static('public'))
const server = app.listen(3000, function() {
    console.log('listening to port 3000')
})
const io = socket(server)

io.on('connection', function(socket){
    socket.on('joinRoom', function({username, room}){
        console.log('socket connected')
        const user = userJoins(socket.id, username, room)
        socket.join(room)
        socket.emit('message', formatMessages('Bot','Welcome to mobile legend' ) )
        const users = getUserRoom(room)
        io.sockets.to(room).emit('roomUsers', {
            room: room,
            users: users
        })
        socket.broadcast.to(room).emit('message',formatMessages('',`${username} has join the chat`) )
        socket.on('typing', function(data){
            socket.broadcast.to(room).emit('typing',data)
        })
        socket.on('chat', function(data){
            io.sockets.emit('chat', data)
        })
        socket.on('disconnect', () => {
            userLeaves(socket.id)
            const updatedUsers = getUserRoom(room)
            io.sockets.to(room).emit('roomUsers', {
                room: room,
                users: updatedUsers
            })
            io.sockets.to(room).emit('message', formatMessages('',`${username} has left the chat`))
        })
    })
    




    // socket.on('typing', function(data){
    //     socket.broadcast.emit('typing',data)
    // })
})

