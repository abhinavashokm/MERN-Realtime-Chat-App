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
    pingTimeout: 60000,
    cors: {
        origin: "http://localhost:3000",
    }
})

//WHEN NEW CONNCTION ESTABLISED
io.on("connection", (socket) => {
    console.log("new connection establised")
    socket.on("disconnect", () => {
        console.log("one user disconnceted");
    });
})


//PORT LISTENING
httpServer.listen(3001, () => {
    console.log('SERVER STARTED!')
});


