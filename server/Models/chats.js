const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    chats: {
        type: Array,
        required: true
    }
})

const ChatModel = new mongoose.model('chats', chatSchema)
module.exports = ChatModel