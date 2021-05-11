const chatForm = document.getElementById("chat-form");

const socket = io();

socket.on("message", message => {
    console.log(message);
    outputMessage(message)
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
function outputMessage(message){
    const div = document.createElement("div");
    div.classList.add("message");
    div.innerHTML = message;
    document.getElementById("c-messages").appendChild(div)
}