// Server Side

// https://momentjs.com/
const moment = require("moment")

// format message that gets the username, text and time with the right format
function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('HH:mm')
    }
}

// Exporting formatMessage
module.exports = formatMessage;