const chatForm = document.getElementById("chat-form");

const socket = io();

socket.on("message", message => {
    console.log(message);
    outputMessage(message)

    // scroll down
    document.getElementById("c-messages").scrollTop = document.getElementById("c-messages").scrollHeight;
})

// submit user messages
chatForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const msg = document.getElementById("msg").value;

    socket.emit("chatMessage", msg);

    document.getElementById("msg").value = "";
    document.getElementById("msg").focus();

})

// send message to DOM
function outputMessage(message) {
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = `<span class="textbox">${message}</span>`;
    document.getElementById("c-messages").appendChild(div)
}

// prompt leave room btn
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {}
});