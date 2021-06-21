//CLIENT SIDE

// Declaring varibles that connects with the html front-end
const chatForm = document.getElementById("chat-form");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// declaring the io function to a variable
const socket = io();

// Emitting "joinRoom" when the user gets navigated to /chat. 
// Happens only when the user logs in 
socket.emit("joinRoom", {
});

// Get room and users
socket.on("roomUsers", ({
    room,
    users
}) => {
    outputRoomName(room);
    outputUsers(users);
});

// Append messages on the client side
socket.on("message", message => {
    console.log(message);
    outputMessage(message)

    // Scroll down on every new chat message
    document.getElementById("c-messages").scrollTop = document.getElementById("c-messages").scrollHeight;
})

// Submit user messages
chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    // Defining msg
    const msg = document.getElementById("msg").value;

    // Emits chatMessage
    socket.emit("chatMessage", msg);

    // Clear message input field and set focus after each send message
    document.getElementById("msg").value = "";
    document.getElementById("msg").focus();

})

// Send message to DOM (Creates the message box)
function outputMessage(message) {
    //Creates div
    const div = document.createElement("div");
    // adds div to classList
    div.classList.add("message");
    //Formatting message
    div.innerHTML =
        `<div id="username time">
            ${message.username} today at: ${message.time}
            <div id="text">
                ${message.text}
            </div>
        </div>`
    document.getElementById("c-messages").appendChild(div)
}


//Gets the rooms name
function outputRoomName(room) {
    
    roomName.innerText = room;
}

// Gets the userList
function outputUsers(users) {
    // Mapping to go through each user in the list
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

// Client side fetching
fetch("/users")
    .then(user => user.json())
    .then(data =>
         data.forEach(user => {
             document.getElementById("all-users").innerHTML += "<h1>" + user.alias + "</h1>"
             console.log(user.username);
    })
)