const moment = require('moment-timezone');

function timeLeft(dueDate) {
    const timeMS = dueDate.getTime() - Date.now();
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
  return moment(date).subtract(5, "hours").toDate();
}

module.exports = {
    timeLeft,
    formatHourTime,
    formatMinTime,
    convertTimezone
};