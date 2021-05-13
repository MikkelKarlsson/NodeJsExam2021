
let hour = new Date().getHours();
let minute = new Date().getMinutes();
let realTime = hour + " : " + minute;

//document.getElementById("timeStamp").innerText = time;

function formatMessage(username, text) {
    return {
        username,
        text,
        time: realTime
    }
}

module.exports = formatMessage;