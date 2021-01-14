const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');

// get username and room from URL
const { username, room } = Qs.parse(location.search,{
    ignoreQueryPrefix:true
})

// socket init
const socket = io();

// join chatroom
socket.emit('joinRoom',{username,room});

// get room and users
socket.on('roomUsers',({room, users})=>{
    outputRoomName(room);
    outputUserNames(users);
})


// msg from server
socket.on('chat',message=>{
    // console.log(message);
    outputMessage(message);


    // scroll down
    chatMessages.scrollTop = chatMessages.scrollHeight;

})

// event for message submission
chatForm.addEventListener('submit',(e)=>{
    e.preventDefault();

    // emit msg to server
    const msg = e.target.elements.msg.value;
    socket.emit('chatMsg',msg);

    // clear input
    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
})

// output msg to DOM
const outputMessage =(msg)=>{
    const { username, text, time } = msg;

    let output = `
        <div class="message">
            <p class="meta">${username} <span>${ time }</span></p>
            <p class="text">
                ${text}
            </p>
        </div>
    `
    document.querySelector('.chat-messages').innerHTML += output;

}

// add room name to DOM
const outputRoomName = (room) => {

    let bgColors = [
        { Javascript: ['#f0db4f','#323330']},
        { Python: ['#4B8BBE','#646464']},
        { PHP: ['#8993be','#232531']},
        { 'C#': ['#7719aa','#000000']},
    ]

    let colors = bgColors.find(bg=> bg[room])

    const styleChatRoom = (chatRoom) => {
        let [ color1, color2 ] = chatRoom[room];
        document.querySelector('.chat-header').style.backgroundColor=`${color1}`;
        document.querySelector('.chat-form-container').style.backgroundColor=`${color1}`;
        document.querySelector('.chat-sidebar').style.backgroundColor=`${color2}`;

    }
    styleChatRoom(colors);
    
    roomName.textContent = room;
}

const outputUserNames = (users) => {
    userList.innerHTML = '';
    userList.innerHTML = 
        users
            .map(user=>  `<li>${user.username}</li>`)
            .join('')
    
    
}