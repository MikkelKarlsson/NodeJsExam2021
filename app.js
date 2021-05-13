const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const formatMessage = require("./public/js/messages");
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require("./public/js/users");



app.use(express.static('public'));

const chatBot = 'ChatBot'

io.on("connection", (socket) => {
    socket.on("joinRoom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);


            // Welcome to a single client
            socket.emit("message", formatMessage(chatBot, "Welcome to KEA Lounge"));

            // To all clients except the connecting user
            socket.broadcast
                .to(user.room)
                .emit("message", formatMessage(chatBot, `${user.username}` + " has joined the chat"));

            // Send users and room info
            io.to(user.room).emit("roomUsers", {
               room: user.room,
               users: getRoomUsers(user.room) 
            });
    });

    // listen for user chat messages
    socket.on("chatMessage", (msg) => {

        const user = getCurrentUser(socket.id);

        io.to(user.room).emit("message", formatMessage(user.username, msg));
    })

    socket.on("disconnect", () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit(
                "message", 
                formatMessage(chatBot, `${user.username}` + " has left the chat"));

            // Send users and room info
            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room) 
             });
        }
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