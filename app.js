const express = require("express");
const app = express();

const server = require("http").createServer(app);

const io = require("socket.io")(server);

app.use(express.static('public'));

io.on("connection", (socket) => {
    console.log("A socket connected with id", socket.id);

    // Welcome to a single client
    socket.emit("message", "Welcome to heaven")

    // To all clients except the connecting user
    socket.broadcast.emit("message", "A user has joined the chat");
        
    socket.on("disconnect", () => {
        io.emit("message", "A user has left the chat")
    })

    // listen for chat messages
    socket.on("chatMessage", (msg) => {
        io.emit("message", msg)
    })
});


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
})

app.get("/chat", (req, res) => {
    res.sendFile(__dirname + "/public/chat.html");
})

server.listen(8080, (error) => {
    if (error) {
        console.log(error);
    }
    console.log("Server is running on port", 8080);
});