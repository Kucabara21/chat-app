const socket = io()

//DOM
const mainMsg = document.querySelector('.chat-messages')
const outputDiv = document.querySelector('.messages')
const feedback = document.querySelector('.feedback')
const handle = document.querySelector('#handle')
const message = document.querySelector('#msg')
const send = document.querySelector('#chat-form')
const leave = document.querySelector('#leave-btn')
const roomName = document.querySelector('#room-name')
const users = document.querySelector('#users')
const urlObject = new URLSearchParams(window.location.search)
const username = urlObject.get('username')
const room = urlObject.get('room')


console.log(username)
console.log(room)
message.addEventListener('keypress', function(){
    socket.emit('typing', username)
})
socket.emit('joinRoom', {username, room})
socket.on('roomUsers', function(data){
    const roomUsers = data.users
    console.log(roomUsers)
    roomName.innerHTML = data.room
    users.innerHTML = roomUsers.map(user => `<li> ${user.username} </li>`).join('')
})

socket.on('message', function(data){
    chatOutput(data);
})
send.addEventListener('submit', function(e){
    // socket.emit('chat', {
    //     message: message.value,
    //     handle: handle.value
    // })
    e.preventDefault();
    const text = message.value
    socket.emit('chat', {text, username})
    message.value = ''
})

//listen
socket.on('chat', function(data){
    feedback.innerHTML = '';
    chatOutput(data)
})

socket.on('typing', function(data){
    feedback.innerHTML = `<p> <em> ${data} is typing a message.. </em> </p>`
})

const chatOutput = (data) => {
    if(data.username == username){
        outputDiv.innerHTML += `<div class="message sender">
                            <p class="meta"> You </p>
                            <p> ${data.text} </p> 
                            </div> `
    }
    else if(data.username == '' ){
        outputDiv.innerHTML += `<div class="message bot">
                            <p class="meta"> ${data.username} </p>
                            <p> ${data.text} </p> 
                            </div> `
    }
    else{
        outputDiv.innerHTML += `<div class="message">
                            <p class="meta"> ${data.username} </p>
                            <p> ${data.text} </p> 
                            </div> `
    }
    
    mainMsg.scrollTop = mainMsg.scrollHeight
}

leave.addEventListener('click', function(){
    window.location.assign('/')
})