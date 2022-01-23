const express = require('express')
const socketio = require('socket.io')
const http = require('http')
const cors = require('cors')

const app = express()
const server = http.createServer(app)

const PORT = process.env.PORT || 5000

const router = require('./router')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users')

const io = socketio(server, {
    cors: {
        origin: '*',
    }
})

io.on('connection', (socket) => {
    console.log('New connection!!')
    socket.on('join', ({ name1, room1 }, callback) => {
        console.log(name1, room1)
        const { error, user } = addUser({ id: socket.id, name1, room1 })
        if (error) return callback(error)

        socket.emit('message', { user: 'admin', text: `${user.name1}, welcome to the room ${user.room1}` })
        socket.broadcast.to(user.room1).emit('message', { user: 'admin', text: `${user.name1}, has joined` })
        socket.join(user.room1)
        console.log(user.room1)
        // io.to(user.room1).emit('roomData', { room1: user.room1, users: getUsersInRoom(user.room1) })
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room1).emit('message', { user: user.name1, text: message })
        //io.to(user.room1).emit('roomData', { user: user.room1, users: getUsersInRoom(user.room1) })
        callback()
    })

    socket.on('disconnect', () => {
        console.log('User left ')
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room1).emit('message', { user: 'admin', text: `${user.name1} has left` })
        }
    })
})

app.use(router)
app.use(cors())

server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`)
})

