// Declaring objects and session
const session = require("express-session");
const users = [];

// Bcrypt variables
const bcrypt = require('bcrypt');
const saltRounds = 10;


// Join user to chat
function userJoin(id, username, room) {
    const user = {
        id,
        username,
        room
    };

    users.push(user);

    return user;

}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.id === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get Room users 
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

// Inserting into database
const login = (app, connection) => {

    // API Post 
    app.post("/signUp", (req, res) => {
        const data = req.body

        bcrypt.hash(data.password, saltRounds, (error, hash) => {
            connection.query("INSERT INTO userLogin (username, password, alias) VALUES (?, ?, ?)", [data.username, hash, data.alias], (rows, fields) => {});
        })

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
                        let user = rows[0];
                        user.room = data.room;
                        req.session.isAuth = true;
                        req.session.user = user;
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