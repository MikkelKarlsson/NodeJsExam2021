// Declaring varibles that connects with the html front-end
const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// declaring the io function to a variable
const socket = io();

// Join chatroom
socket.emit("joinRoom", { 
    // username, 
    // room
});

// Get room and users
socket.on("roomUsers", ({ room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

// Write usermessage
socket.on("message", message => {
    console.log(message);
    outputMessage(message)

    // Scroll down on every new chat message
    document.getElementById("c-messages").scrollTop = document.getElementById("c-messages").scrollHeight;
})

// Submit user messages
chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const msg = document.getElementById("msg").value;

    socket.emit("chatMessage", msg);

    // Clear message input field and set focus after each send message
    document.getElementById("msg").value = "";
    document.getElementById("msg").focus();

})

// Send message to DOM
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message"); 
    div.innerHTML = 
        `<div id="username time">
            ${message.username} today at: ${message.time}
            <div id="text">
                ${message.text}
            </div>
        </div>`
    document.getElementById("c-messages").appendChild(div)
}


// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join("")}
    `;
}


// Prompt leave room btn
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {}
});




