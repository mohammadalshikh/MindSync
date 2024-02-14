const moment = require('moment-timezone');

function timeLeft(dueDate) {
    const timeMS = dueDate.getTime() - convertTimezone(Date.now());
    if (timeMS < 0) return -1;
    return {
        days: Math.floor(timeMS / (1000 * 60 * 60 * 24)),
        hours: Math.floor((timeMS % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((timeMS % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((timeMS % (1000 * 60)) / 1000),
    }
}

function formatHourTime(time) {
    return time < 1 ? `0${time}` : `${time}`;
}

function formatMinTime(time) {
    return time < 10 ? `0${time}` : `${time}`;
}

function convertTimezone(date) {
    const inputDate = new Date(date);
    const currentOffset = moment().utcOffset() / 60;
    var newYorkTime = moment.tz("America/New_York").format();
    newYorkTime = newYorkTime.substring(0, newYorkTime.length - 6);
    const offsetDate = new Date(newYorkTime);
    const offset = offsetDate.getUTCHours();
    if (currentOffset == 0) {
        if (offset % 5 == 0) {
            inputDate.setHours(inputDate.getHours() - 5);
        } else {
            inputDate.setHours(inputDate.getHours() - 4);
        }
    }
    return inputDate.getTime();
}

module.exports = {
    timeLeft,
    formatHourTime,
    formatMinTime,
    convertTimezone
};