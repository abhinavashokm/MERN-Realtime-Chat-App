import React, { useContext } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat'
import { unreadMessagesContext } from '../../../Store/UnreadMessages'

function SavedContacts({ props }) {

    const { contactsList } = props
    const { setCurrentChat, currentChat } = useContext(currentChatContext)
    const { unreadMessages } = useContext(unreadMessagesContext)

    let newMessage = false
    let selectedChat = false

    return (
        <div>
            {
                contactsList && contactsList.map((contact, index) => {
                    //for checking there is any unread message for this contact
                    if (unreadMessages.some(obj => obj.senderId === contact._id)) {
                        newMessage = true
                    } else {
                        newMessage = false
                    }
                    //for checking is it this the selected chat
                    if (currentChat && contact._id === currentChat._id) {
                        selectedChat = true
                    } else {
                        selectedChat = false
                    }
                    return (
                        <div onClick={() => {
                            setCurrentChat(contact)

                        }} key={index} className={selectedChat ? "selected-contact-item" : "contact-item"} >

                            <span className='contactName'>{contact.FullName}</span>
                            {
                                newMessage &&
                                <div className='unreadMessages-badge' >
                                    <span>new</span>
                                </div>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SavedContacts