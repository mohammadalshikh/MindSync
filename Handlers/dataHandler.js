const fs = require('fs');
const path = require('path');

function loadUserData() {
    const filePath = path.resolve(__dirname, '../Data/data.json');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading user data file:', error.message);
        return {};
    }
}

function saveUserData(userData) {
    const filePath = path.resolve(__dirname, '../Data/data.json');
    try {
        const data = JSON.stringify(userData, null, 2);
        fs.writeFileSync(filePath, data, 'utf8');
        console.log('User data saved successfully.');
    } catch (error) {
        console.error('Error saving user data file:', error.message);
    }
}

function updateTask(userId, taskName, status) {
    const userData = loadUserData();
    const taskIndex = getTaskIdx(userId, taskName);
    
    if (userData[userId] && userData[userId].tasks[taskIndex]) {
        userData[userId].tasks[taskIndex].interval = null;
        userData[userId].tasks[taskIndex].status = status;
        saveUserData(userData);
        return true;
    }
    return false
}

function deleteTask(userId, taskName) {
    const userData = loadUserData();
    const taskIndex = getTaskIdx(userId, taskName);
        
    if (userData[userId] && userData[userId].tasks[taskIndex]) {
            userData[userId].tasks.splice(taskIndex, 1);
            saveUserData(userData);
            return true
        }
    return false 
}

function getTaskIdx(userId, taskName) {
    const userData = loadUserData();
    if (userData[userId]) {
        const userTasks = userData[userId].tasks;
        if (userTasks) {
            const taskIndex = userTasks.findIndex(task => task.name.toLowerCase() === taskName.toLowerCase());
            return taskIndex;
        }
    }  
    return -1;
}

function getDueDate(userId, taskName) {
    const userData = loadUserData();
    const taskIndex = getTaskIdx(userId, taskName);

    if (userData[userId] && userData[userId].tasks[taskIndex]) {
        return userData[userId].tasks[taskIndex].due;
    }
}

function getInterval(userId, taskName) {
    const userData = loadUserData();
    const taskIndex = getTaskIdx(userId, taskName);

    if (userData[userId] && userData[userId].tasks[taskIndex]) {
        return userData[userId].tasks[taskIndex].interval;
    }
    return -1
}

function getStatus(userId, taskName) {
    const userData = loadUserData();
    const taskIndex = getTaskIdx(userId, taskName);

    if (userData[userId] && userData[userId].tasks[taskIndex]) {
        return userData[userId].tasks[taskIndex].status;
    }
}

function getMessageState(userId, taskName) {
    const userData = loadUserData();
    const taskIndex = getTaskIdx(userId, taskName);

    if (userData[userId] && userData[userId].tasks[taskIndex]) {
        return userData[userId].tasks[taskIndex].deletedMsg;
    }
}

function getDel(userId) {
    const userData = loadUserData()
    
    if (userData[userId]) {
        return userData[userId].del
    } else {
        return 'User Not Found'
    }
}

function getTimezone(userId) {
    const userData = loadUserData()

    if (userData[userId]) {
        return userData[userId].timezone
    }
}

function setTimezone(userId, zone) {
    const userData = loadUserData();
    
    if (userData[userId]) {
        userData[userId].timezone = zone
    }
}


module.exports = {
    loadUserData,
    saveUserData,
    updateTask,
    deleteTask,
    getTaskIdx,
    getDueDate,
    getInterval,
    getStatus,
    getMessageState,
    getDel,
    getTimezone,
    setTimezone,
};

