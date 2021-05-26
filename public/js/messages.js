// https://momentjs.com/
const moment = require("moment")



//document.getElementById("timeStamp").innerText = time;

function formatMessage(username, text) {
    return {
        username,
        text,
        time: moment().format('HH:mm')
    }
}

module.exports = formatMessage;