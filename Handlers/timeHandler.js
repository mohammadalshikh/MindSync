const moment = require('moment-timezone');
const { getTimezone } = require('./dataHandler');

function timeLeft(dueDate, userId) {
    const timeMS = dueDate.getTime() - getZoneDate(userId).getTime();
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

function getZoneDate(userId) {
    const zone = getTimezone(userId)
    var zoneString = moment.tz(zone).format();
    zoneString = zoneString.substring(0, 19);
    const zoneDate = new Date(zoneString);
    return zoneDate;
}

module.exports = {
    timeLeft,
    formatHourTime,
    formatMinTime,
    getZoneDate
};