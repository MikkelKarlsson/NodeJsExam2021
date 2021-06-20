// https://momentjs.com/
const moment = require("moment")

// Function that returns the message when logging in
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('HH:mm')
    }
}

// Exporting formatMessage
module.exports = formatMessage;