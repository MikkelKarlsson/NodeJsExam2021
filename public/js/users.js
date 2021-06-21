// Server Side

// Declaring objects and session
const session = require("express-session");
const users = [];

// Bcrypt variables
const bcrypt = require('bcrypt');
// Higher saltround, bigger complexity of the hashing
const saltRounds = 10;


// Join user to chat
function userJoin(id, username, room) {
    const user = {
        id,
        username,
        room
    };

    // Adding user to array
    users.push(user);

    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {

    // Find index by matching user id with the socket id
    const index = users.findIndex(user => user.id === id);

    // Splices the user out of the array
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get Room users 
function getRoomUsers(room) {

    //Returns users within the room
    return users.filter(user => user.room === room);
}

// Inserting into database
const login = (app, connection) => {

 //Server side fetching
 app.get("/users",(req, res, next) => {
         // Select from mysql database and give rows as json result
         connection.query("SELECT username, alias FROM userLogin", (err, rows, fields) => {
             console.log("Succesfully fetched all users");
             res.json(rows);
        })
 })

    // API Post 
    app.post("/signUp", (req, res) => {
        const data = req.body

        // Hashing the password by using bcrypt
        bcrypt.hash(data.password, saltRounds, (error, hash) => {
            connection.query("INSERT INTO userLogin (username, password, alias) VALUES (?, ?, ?)", [data.username, hash, data.alias], (rows, fields) => {});
        })

        //Redirecting to index
        res.redirect("/")
    });

    // Confirming that its the right username and password. If it is, its redirect to the chatpage, if not, it redirects to starter page.
    // Checking login credentials
    app.post("/", (req, res) => {
        const data = req.body
        connection.query("SELECT * FROM userLogin where username = ?", [data.username], (fields, rows, hash) => {
            if (rows.length > 0) {
                // Compare req password with hashed password in DB by using bcrypt compare function
                bcrypt.compare(data.password, rows[0].password, (err, result) => {
                    if (result) {
                        //Gets the user
                        let user = rows[0];

                        //Gives the user the room the user chooses from the page
                        user.room = data.room;

                        // Users is logged in
                        req.session.isAuth = true;
                        req.session.user = user;

                        // Redirects to the chat
                        res.redirect("/chat");
                    } else {
                        res.redirect("/");
                    }
                });
            }
        });
    });
}



// Exports modules
module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    login,
}