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
    if (userData[userId] && userData[userId][taskIndex]) {
        userData[userId][taskIndex].interval = null;
        userData[userId][taskIndex].status = status;
        saveUserData(userData);
    }
}

function deleteTask(userId, taskName) {
    const userData = loadUserData();
    const taskIndex = getTaskIdx(userId, taskName);

    if (userData[userId] && userData[userId][taskIndex]) {
        userData[userId].splice(taskIndex, 1);
        saveUserData(userData);
    }
}

function getTaskIdx(userId, taskName) {
    const userData = loadUserData();
    const userTasks = userData[userId];

    if (userTasks) {
        const taskIndex = userTasks.findIndex(task => task.name === taskName);
        return taskIndex;
    }

    return -1;
}

function getDueDate(userId, taskName) {
    const userData = loadUserData();
    const taskIndex = getTaskIdx(userId, taskName);

    if (userData[userId] && userData[userId][taskIndex]) {
        return new Date(userData[userId][taskIndex].due);
    }
}

function getInterval(userId, taskName) {
    const userData = loadUserData();
    const taskIndex = getTaskIdx(userId, taskName);

    if (userData[userId] && userData[userId][taskIndex]) {
        return userData[userId][taskIndex].interval;
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
};

