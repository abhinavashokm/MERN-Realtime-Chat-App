const UserModel = require('../Models/Users')
const ContactListModel = require('../Models/ContactList')

//LIST OF SOCKET CONNECTED USERS
let users = []

//FOR GET CURRENT TIME
const getCurrentTime = () => {
    const date = new Date()
    let hours = ("0" + date.getHours()).slice(-2)
    let minutes = ("0" + date.getMinutes()).slice(-2)
    return currentTime = hours + ':' + minutes
}

//HELPER FUNCTIONS
module.exports = {
    users,
    addUser: (userId, socketId) => {
        let userContain = users.some(user => user.userId === userId)
        if (!userContain) {
            users.push({ userId, socketId })
            console.log("new user logined")
            console.log(users.length + " users online")
        }
    },
    removeUser: (socketId) => {
        let userContain = users.some(user => user.socketId === socketId)
        if (userContain) {
            users = users.filter(user => user.socketId !== socketId)
            console.log("one user disconnected");
            console.log(users.length + " users online")
        }
    },
    removeUserManually: (userId) => {
        let userContain = users.some(user => user.userId === userId)
        if (userContain) {
            users = users.filter(user => user.userId !== userId)
            console.log("one user disconnected");
            console.log(users.length + " users online")
        }
    },
    findUser: (userId) => {
        return users.find(user => user.userId === userId)
    },
    updateLastSeen: (socketId, userIdParameter) => {
        let userId
        let lastSeen = getCurrentTime()
        if (!userIdParameter) {
            //if userId not passed by argument
            const user = users.filter(user => user.socketId === socketId)
            if (user[0]) {
                userId = user[0].userId
            }
        } else {
            //if userId passed by argument
            userId = userIdParameter
        }
        if (userId) {
            const filter = { _id: userId }
            const update = { LastSeen: lastSeen }
            UserModel.findOneAndUpdate(filter, update, null, (err) => {
                if (err) {
                    console.log(err)
                }
            })
        }
    },
    usersChangeListener: (io) => {
        io.emit("usersChange", users)
    },
    ifUserAlreadyLogined: (userId) => {
        return new Promise((resolve, reject) => {
            const userAlreadyLogined = users.some(userObj => userObj.userId === userId)
            resolve(userAlreadyLogined)
        })
    },
    getContactList: (userId) => {
        return new Promise((resolve, reject) => {
            ContactListModel.find({ UserId: userId }, (err, data) => {
                if (!err && data[0]) {
                    resolve(data[0].Contacts)
                }
            })
        })
    },
    findOneUser : (userId) => {
        return new Promise((resolve, reject ) => {
            const filter = {_id : userId}
            UserModel.find(filter,(err, data) => {
                if(!err) {
                    resolve(data[0])
                }
            })
        })
    }
}