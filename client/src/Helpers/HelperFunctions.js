import axios from "axios"

const addToContactList = (contactId, userId) => {
    return new Promise((resolve, reject) => {
        axios.post("http://localhost:3001/findOneUser", { userId: contactId }).then((contactDetails) => {
            if (contactDetails.data) {
                axios.post("http://localhost:3001/addNewContact", { userId: userId, contact: contactDetails.data }).then((newContactList) => {
                    console.log("added to contacts")
                    resolve(newContactList.data)
                })
            }
        })
    })
}

export { addToContactList }