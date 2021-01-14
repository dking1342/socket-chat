let users = [];

// join user to chat
const userJoin=(id,username,room)=>{
    const user = { id, username, room};

    users.push(user);
    return user;
}

const getCurrentUser=(id)=>{
    return users.find(user=>user.id === id);
}

// user leaves chat
const userLeave = (id) => {
    let index = users.findIndex(user=> user.id === id);
    return users.splice(index,1)[0];
}

// get room users
const getRoomUsers = (room)=>{
    return users.filter(user=> user.room === room)
}


module.exports = {
    users, 
    userJoin, 
    getCurrentUser,
    userLeave,
    getRoomUsers
}