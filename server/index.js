const express = require('express')
const http = require("http");
const { Server } = require("socket.io");

// MONGODB CONNCETION
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/ChatApp')

//SOCKET.IO SETUP
const app = express()
const httpServer = http.createServer(app)
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
    }
})

//WHEN NEW CONNCTION ESTABLISED
io.on("connection", (socket) => {
    console.log("new connection establised")
})

//PORT LISTENING
httpServer.listen(3001, () => {
    console.log('SERVER STARTED!')
});


