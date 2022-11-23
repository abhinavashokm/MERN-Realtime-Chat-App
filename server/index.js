const express = require('express')
const http = require("http");
const { Server } = require("socket.io");
const UserModel = require('./Models/Users')
const ContactListModel = require('./Models/ContactList')
const cors = require('cors')
const bcrypt = require('bcrypt');
const userHelper = require('./Helpers/UsersHelper')


//MONGODB CONNCETION
const mongoose = require('mongoose')
const UsersHelper = require('./Helpers/UsersHelper');
const { resolve4 } = require('dns/promises');
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
    socket.on("sendMessage", async ({ senderId, recieverId, msg, time, createdAt }) => {
        const recieverUser = await userHelper.findUser(recieverId)
        if (recieverUser) {
            io.to(recieverUser.socketId).emit("recieveMessage", { senderId, msg, recieverId, time, createdAt })
        }
    })

    //message seened responce
    socket.on("messageViewed", async ({recieverId,senderId}) => {
        const recieverUser = await userHelper.findUser(recieverId)
        if(recieverUser) {
        io.to(recieverUser.socketId).emit("messageViewedResponce",senderId)
        }
    })

})

//ROUTERS
//for fetching all contacts in the database
app.get('/getAllUsers', (req, res) => {
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
    let login
    let errorMsg
    const { UserName, Password } = req.body
    UserModel.find({ UserName }, (err, user) => {
        if (err) {
            login = false
            errorMsg = "something went wrong"
            res.json({ login, errorMsg })
        } else {
            if (user.length > 0) {
                bcrypt.compare(Password, user[0].Password, function (err, result) {
                    if (err) {
                        login = false
                        errorMsg = "something went wrong"
                        res.json({ login, errorMsg })
                    } else if (!result) {
                        //if password does not match
                        login = false
                        errorMsg = "password does not match!"
                        res.json({ login, errorMsg })
                    } else {
                        //username and password verification successfull
                        userHelper.ifUserAlreadyLogined((user[0]._id).toString()).then((userAlreadyLogined) => {
                            if (userAlreadyLogined) {
                                //if user already logged in
                                login = false
                                errorMsg = "user already logged in!"
                                res.json({ login, errorMsg })
                            } else {
                                //finally login success
                                login = true
                                res.json({ user, login })
                            }
                        })
                    }
                })
            } else {
                //if user not found
                login = false
                errorMsg = "user not found!"
                res.json({ login, errorMsg })
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

            const contact = { UserId: newUser._id, Contacts: [], Blocked: [] }
            const newContactList = ContactListModel(contact)
            await newContactList.save()
            res.json()
        }
    });
})
//return all saved contacts of the user
app.post('/getContactList', async (req, res) => {
    const { userId } = req.body
    UsersHelper.getContactList(userId).then((result) => {
        if (result) {
            res.json(result)
        } else {
            res.json(false)
        }
    })
})
//return all the details of requested user
app.post("/findOneUser", (req, res) => {
    const { userId } = req.body
    userHelper.findOneUser(userId).then((userDetails) => {
        res.json(userDetails)
    })
})
//add new contact to the users contact list
app.post('/addNewContact', (req, res) => {
    const { contact, userId } = req.body
    const filter = { UserId: userId }
    const update = { Contacts: contact }
    ContactListModel.findOneAndUpdate(filter, { $push: update }, null,
        (err) => {
            if (!err) {

                userHelper.getContactList(userId).then((result) => {
                    if (result) {
                        res.json(result.Contacts)
                    }
                })

            }
        })
})
app.post("/removeAContact", (req, res) => {
    const { userId, contactId } = req.body

    const filter = { UserId: userId }
    const update = { Contacts: { _id: contactId } }
    ContactListModel.findOneAndUpdate(filter, { $pull: update }, null,
        (err) => {
            if (!err) {

                userHelper.getContactList(userId).then((result) => {
                    if (result) {
                        res.json(result.Contacts)
                    }
                })
            }
        })

})
app.post("/blockAContact", (req, res) => {
    const { contact, userId } = req.body

    const filter = { UserId: userId }
    const update = { Blocked: contact }
    ContactListModel.findOneAndUpdate(filter, { $push: update }, null,
        (err) => {
            if (!err) {

                userHelper.getContactList(userId).then((result) => {
                    if (result) {
                        res.json(result.Blocked)
                    }
                })

            }
        })
})
app.post("/unblockAContact", (req, res) => {
    const { contactId, userId } = req.body

    const filter = { UserId: userId }
    const update = { Blocked: { _id: contactId } }
    ContactListModel.findOneAndUpdate(filter, { $pull: update }, null,
        (err) => {
            if (!err) {

                userHelper.getContactList(userId).then((result) => {
                    if (result) {
                        res.json(result.Blocked)
                    }
                })
            }
        })
})
// app.post("/getBlockedContacts",(req, res))

//PORT LISTENING
httpServer.listen(3001, () => {
    console.log('SERVER STARTED!')
});



