const chatForm = document.getElementById("chat-form");

//Get username and room from URL
const { username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

console.log(username, room);

const socket = io();

// Join chatroom
socket.emit("joinRoom", { username, room})

socket.on("message", message => {
    console.log(message);
    outputMessage(message)

    // scroll down on every new chat message
    document.getElementById("c-messages").scrollTop = document.getElementById("c-messages").scrollHeight;
})

// submit user messages
chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const msg = document.getElementById("msg").value;

    socket.emit("chatMessage", msg);

    // clear message input field and set focus after each send message
    document.getElementById("msg").value = "";
    document.getElementById("msg").focus();

})

// send message to DOM
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

// prompt leave room btn
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {}
});