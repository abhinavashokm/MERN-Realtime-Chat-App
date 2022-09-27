const express = require('express')
const app = express()
const mongoose =  require('mongoose')

mongoose.connect('mongodb://localhost:27017/ChatApp').then(()=> {
    console.log("CONNECTED TO DATABASE SUCCESSFULLY!")
})

app.listen(3001,() => {
    console.log('SERVER STARTED!')
})
