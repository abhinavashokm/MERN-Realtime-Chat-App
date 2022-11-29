import React,{useContext} from 'react'
import { findOneUser } from '../../../Helpers/HelperFunctions'
import { currentChatContext } from '../../../Store/CurrentChat'

function Contact({props}) {

    const {contact, selectedChat, lastMessage, unreadMessagesCount} = props
    const {setCurrentChat} = useContext(currentChatContext)

    return (

        <div
            onClick={() => {
                findOneUser(contact._id).then((userDetails) => {
                    setCurrentChat(userDetails)
                })
            }}
            className={selectedChat ? "Contact-Selected" : "Contact"}
        >
            {
                selectedChat ? 
                <img className='contact-avtar-img' src="Images/selected-contact-avatar.png" alt="person" />
                :
                <img className='contact-avtar-img' src="Images/contact-avatar.png" alt="person" />
            }
            

            <div className='ContactLeftDiv' >
                <span className='contactName'>{contact.FullName}</span>
                {lastMessage && <span className='lastMsg' >{lastMessage.isYours ? <span>You: </span> : ""} {lastMessage.message}</span>}
            </div>

            <div className='ContactRightDiv' >
                {lastMessage && <span className='lastMsgTime' >{lastMessage.time}</span>}
                {
                    unreadMessagesCount &&
                    <div className='unreadMessages-badge' >
                        <span>{unreadMessagesCount}</span>
                    </div>
                }
            </div>

        </div>

    )
}

export default Contact