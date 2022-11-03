const express = require('express')
const http = require("http");
const { Server } = require("socket.io");
const UserModel = require('./Models/users')
const cors = require('cors')
const bcrypt = require('bcrypt');


//MONGODB CONNCETION
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/ChatApp')

//SOCKET.IO SETUP
const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})

//MIDDLEWARES
app.use(cors())
app.use(express.json())

//LIST OF SOCKET CONNECTED USERS
let users = []

//HELPER FUCTIONS
const addUser = (userId, socketId) => {
    let userContain = users.some(user => user.userId === userId)
    if (!userContain) {
        users.push({ userId, socketId })
        console.log("new user logined")
        console.log(users.length + " users online")
    }
}
const removeUser = (socketId) => {
    let userContain = users.some(user => user.socketId === socketId)
    if (userContain) {
        users = users.filter(user => user.socketId !== socketId)
        console.log("one user disconnected");
        console.log(users.length + " users online")
    }
}
const removeUserManually = (userId) => {
    let userContain = users.some(user => user.userId === userId)
    if (userContain) {
        users = users.filter(user => user.userId !== userId)
        console.log("one user disconnected");
        console.log(users.length + " users online")
    }
}
const findUser = (userId) => {
    return users.find(user => user.userId === userId)
}
const getCurrentTime = () => {
    const date = new Date()
    let hours = ("0" + date.getHours()).slice(-2)
    let minutes = ("0" + date.getMinutes()).slice(-2)
    return currentTime = hours + ':' + minutes
}
const updateLastSeen = (socketId, userIdParameter) => {
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
}
//every time online userList modified the list will be updated in to all client side users
const usersChangeListener = () => {
    io.emit("usersChange", users)
}

//SOCKET.IO CONNECTIONS
io.on("connection", (socket) => {

    //add user to online list of users
    socket.on("addUser", (userId) => {
        addUser(userId, socket.id)
        io.to(socket.id).emit("onlineUsersList", users)
        usersChangeListener()
    })

    //when disconnected
    socket.on("disconnect", () => {
        updateLastSeen(socket.id)
        removeUser(socket.id)
        usersChangeListener()
    })

    //remove user from online list when user manually logout 
    socket.on("removeUser", ({ userId }) => {
        updateLastSeen(socket.id, userId)
        removeUserManually(userId)
        usersChangeListener()
    })

    //recieve private messages from sender and send it to the target user
    socket.on("sendMessage", async ({ senderId, recieverId, msg, time }) => {
        const recieverUser = await findUser(recieverId)
        if (recieverUser) {
            io.to(recieverUser.socketId).emit("recieveMessage", { senderId, msg, recieverId, time })
        }
    })

})

//ROUTERS

//for fetching all contacts in the database
app.get('/getAllContacts', (req, res) => {
    UserModel.find({}, (err, data) => {
        if (err) {
            res.json(false)
        } else {
            res.json(data)
        }
    })
})

//manage login
app.post('/userLogin', async (req, res) => {
    const { UserName, Password } = req.body
    UserModel.find({ UserName }, (err, user) => {
        if (err) {
            res.json(false)
        } else {
            if (user.length > 0) {
                bcrypt.compare(Password, user[0].Password, function (err, result) {
                    if (err) {
                        res.json(false)
                    } else if (!result) {
                        res.json(false)
                    } else {
                        res.json(user)
                    }
                })
            }
        }
    })
})

//manage signup
app.post('/createUser', (req, res) => {
    const user = req.body
    const saltRounds = 10
    //hash key of the password will store in database
    bcrypt.hash(user.Password, saltRounds, async function (err, hash) {
        if (err) {
            res.json()
        } else {
            user.Password = hash
            const newUser = UserModel(user)
            await newUser.save()
            res.json()
        }
    });
})

//PORT LISTENING
httpServer.listen(3001, () => {
    console.log('SERVER STARTED!')
});



