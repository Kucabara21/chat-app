let users = []
const userJoins = (id, username, room) => {
    const user = {id, username, room}
    users.push(user)
    return user;
}

const getUserRoom = (room) => {
    return users.filter(user => user.room == room)
}

const userLeaves = (id) => {
    users = users.filter(user => user.id !== id)
}
module.exports = {
    userJoins,
    getUserRoom,
    userLeaves
}