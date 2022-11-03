import React, { useContext, useEffect, useState } from 'react'
import './Contacts.css'
import axios from 'axios'
import { authContext } from '../../Auth/AuthContext'
import { currentChatContext } from '../../Store/CurrentChat'
import { unreadMessagesContext } from '../../Store/UnreadMessages'
import { confirmAlert } from 'react-confirm-alert'; // Import alert npm
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css for alert


function Contacts() {

  const { user, setUser, socket } = useContext(authContext)
  const { setCurrentChat, currentChat } = useContext(currentChatContext)
  const { unreadMessages } = useContext(unreadMessagesContext)


  const [contactsList, setContactsList] = useState([])

  useEffect(() => {
    axios.get("http://localhost:3001/getAllContacts").then((res) => {
      if (!res.data) {
        console.log("something went wrong")
      } else {
        if (user) {
          let contacts = res.data.filter(contact => contact._id !== user._id)
          setContactsList(contacts)
        }
      }
    })
  }, [user])

  //fuction for signout current user
  const logoutUser = () => {
    confirmAlert({
      title: 'Logout',
      message: 'Are you sure want to logout,all chats you made will lost!',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            setCurrentChat(null)
            socket.current.emit("removeUser", { userId: user._id })
            setUser(null)
          }
        },
        {
          label: 'No',
          onClick: () => { }
        }
      ]
    })
  }

  let newMessage = false
  let selectedChat = false

  return (
    <div className='contacts-container'>
      <div className="profileBand">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA7ECizMinUV4oPQG6BUFIZZmeXehbj7pytQ&usqp=CAU" alt="person" />
        {user && <span>{user.FullName}</span>}
        <button onClick={logoutUser} >Logout</button>
      </div>
      <div className='contact-list'>
        {
          contactsList.map((contact, index) => {
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
                  newMessage && <div className='unreadMessages-badge' >
                    <span>new</span>
                  </div>
                }
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Contacts