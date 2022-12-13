import React, { useContext } from 'react'
import { authContext } from '../../../Auth/AuthContext';
import { currentChatContext } from '../../../Store/CurrentChat';
import { contactListContext } from '../../../Store/ContactList';
import { chatsContext } from '../../../Store/ChatsContext';
import { chatHelper } from '../../../Helpers/ChatHelper';
import { addToContactList } from '../../../Helpers/HelperFunctions';
import ChatBox from '../Conditional/ChatBox';
import EmptyChat from '../Conditional/EmptyChat';
import "../Chat.css"

function Chat({props}) {

  const { pendingMessages, setPendingMessages, onlineList } = props

  const { user } = useContext(authContext)
  const { currentChat } = useContext(currentChatContext)
  const { setContactsList } = useContext(contactListContext)
  const { sendMessage, addToPendingMessages, isAlreadyInContactList } = useContext(chatHelper)
  const { chats, setChats } = useContext(chatsContext)


  //this fucnction for sending private message
  const handleMessageSubmit = async ({ message, setMessage }) => {

    isAlreadyInContactList(currentChat._id).then((oldContact) => {
      if (!oldContact) {
        addToContactList(user._id, currentChat).then((newContactList) => {
          setContactsList(newContactList)
        })
      }
    })

    sendMessage(message, user._id, currentChat._id, onlineList).then((messageObj) => {
      setChats(c => [...c, messageObj])
      setMessage('')
    }).catch((messageObj) => {
      setChats(c => [...c, messageObj])
      addToPendingMessages(messageObj, pendingMessages, setPendingMessages)
      setMessage('')
    })

  }

  return (
    <div className='Chat-Section' >
      {currentChat
        ? <ChatBox props={{ chats, handleMessageSubmit, onlineList }} />
        : <EmptyChat />
      }
    </div>
  )
}

export default Chat