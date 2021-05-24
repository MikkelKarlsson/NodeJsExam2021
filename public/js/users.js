const session = require("express-session");

const users = [];

// Join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room };

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

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get Room users 
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

const login = (app, connection) => {
    app.post("/signUp", (req, res) => {
        const data = req.body
        connection.query("INSERT INTO userLogin SET ?", data, (rows, fields) => {
            console.log("Created User: " + data.username + " With Alias: " + data.alias);
        });
        res.redirect("/")
    }); 

    app.post("/", (req, res) => {
        const data = req.body
        
        console.log(data.username + " AND " + data.password);
        connection.query("SELECT * FROM userLogin where username = ? and password = ?", [data.username, data.password], (fields, rows) => {
            if(rows.length > 0){
                let user = rows[0];
                user.room = data.room;
                req.session.isAuth = true;
                req.session.user = user;
                res.redirect("/chat");
            } else {
                res.redirect("/");
            }
        });
    }); 

}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    login,
}
