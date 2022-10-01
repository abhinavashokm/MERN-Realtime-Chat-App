const express = require('express')
const http = require("http");
const { Server } = require("socket.io");
const UserModel = require('./Models/users')
const cors = require('cors')

// MONGODB CONNCETION
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

app.use(cors())
app.use(express.json())

//WHEN NEW CONNCTION ESTABLISED
io.on("connection", (socket) => {
    console.log("new connection establised")
    socket.on("disconnect", () => {
        console.log("one user disconnceted");
    });
})

//ROUTERS
app.post('/userLogin', async ( req , res ) => {
    const {UserName , Password} = req.body
    UserModel.find({UserName},(err, user) => {
        if(err) {
            res.json(false)
        } else {
            
            if(user[0].Password != Password) {
                res.json(false)
            } else {
                res.json(user)
            }
        }
    })
})
app.post('/createUser' , async ( req, res ) => {
    const user = req.body
    const newUser = UserModel(user)
    console.log(newUser)
    await newUser.save()
    res.json()
})

//PORT LISTENING
httpServer.listen(3001, () => {
    console.log('SERVER STARTED!')
});



