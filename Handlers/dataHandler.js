const fs = require('fs');
const { get } = require('http');
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

function getSystemPrompt() {
    const filePath = path.resolve(__dirname, '../Data/prompt.txt');
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return data;
    } catch (error) {
        console.error('Error reading system prompt file:', error.message);
        return {};
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
    } else {
        setTimezone(userId, 'America/Toronto')
        getTimezone(userId)
    }
}

function getUserTasks(userId) {
    const userData = loadUserData();
    if (userData[userId]) {
        const userTasks = userData[userId].tasks;
        if (userTasks) {
            let tasksData = '';
            let i = 1;
            for (const userTask in userTasks) {
                const data = `Task #${i}\n` + 
                             `Name: ${userTasks[userTask].name}\n` + 
                             `Due: ${userTasks[userTask].due}\n` +
                             `Status: ${userTasks[userTask].status}\n\n`
                i += 1;
                tasksData += data
            }
            return tasksData
        } else {
            return 'No data';
        }
    }
    
}

function setTimezone(userId, zone) {
    const userData = loadUserData();
    
    if (userData[userId]) {
        userData[userId].timezone = zone
    } else {
        userData[userId] = {
            tasks: [],
            del: [],
            timezone: zone
        }
    }
    saveUserData(userData)
}


module.exports = {
    loadUserData,
    saveUserData,
    getSystemPrompt,
    updateTask,
    deleteTask,
    getTaskIdx,
    getDueDate,
    getInterval,
    getStatus,
    getMessageState,
    getDel,
    getUserTasks,
    getTimezone,
    setTimezone,
};

