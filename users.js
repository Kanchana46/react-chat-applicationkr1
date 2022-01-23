const users = []

const addUser = ({ id, name1, room1 }) => {
    name1 = name1.trim().toLowerCase()
    room1 = room1.trim().toLowerCase()

    const existingUser = users.find((user) => user.room === room1 && user.name === name1)

    if (existingUser) {
        return { error: 'username is taken' }
    }

    const user = { id, name1, room1 }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}

const getUser = (id) => users.find(user => user.id === id)

const getUsersInRoom = (room1) => users.filter(user => user.room1 === room1)

module.exports = { addUser, removeUser, getUser, getUsersInRoom }