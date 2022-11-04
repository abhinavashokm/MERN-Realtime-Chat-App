const express = require('express')
const http = require("http");
const { Server } = require("socket.io");
const UserModel = require('./Models/users')
const cors = require('cors')
const bcrypt = require('bcrypt');
const userHelper = require('./Helpers/UsersHelper')


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
let users = userHelper.users

//SOCKET.IO CONNECTIONS
io.on("connection", (socket) => {

    //add user to online list of users
    socket.on("addUser", (userId) => {
        userHelper.addUser(userId, socket.id)
        io.to(socket.id).emit("onlineUsersList", users)
        userHelper.usersChangeListener(io)
    })

    //when disconnected
    socket.on("disconnect", () => {
        userHelper.updateLastSeen(socket.id)
        userHelper.removeUser(socket.id)
        userHelper.usersChangeListener(io)
    })

    //remove user from online list when user manually logout 
    socket.on("removeUser", ({ userId }) => {
        userHelper.updateLastSeen(socket.id, userId)
        userHelper.removeUserManually(userId)
        userHelper.usersChangeListener(io)
    })

    //recieve private messages from sender and send it to the target user
    socket.on("sendMessage", async ({ senderId, recieverId, msg, time }) => {
        const recieverUser = await userHelper.findUser(recieverId)
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



