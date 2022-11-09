const mongoose = require('mongoose')

const contactListSchema = new mongoose.Schema({
    UserId: {
        type: String,
        required: true

    },
    Contacts: {
        type: Array,
        required: true
    }
})

const ContactListModel = new mongoose.model('contactList', contactListSchema)
module.exports = ContactListModel