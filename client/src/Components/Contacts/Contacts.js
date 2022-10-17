import React, { useContext, useEffect, useState } from 'react'
import './Contacts.css'
import axios from 'axios'
import { userContext } from '../../Store/UserContext'
import { currentChatContext } from '../../Store/CurrentChat'
import { confirmAlert } from 'react-confirm-alert'; // Import alert npm
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css for alert


function Contacts() {

  const { user, setUser, socket } = useContext(userContext)
  const { setCurrentChat } = useContext(currentChatContext)

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
            socket.current.emit("removeUser",{userId:user._id})
            setUser(null)
          }
        },
        {
          label: 'No',
          onClick: () => {}
        }
      ]
    })
  }


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
            return (
              <div onClick={() => {
                setCurrentChat(contact)

              }} key={index} className="contact-item">

                <span className='contactName'>{contact.FullName}</span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default Contacts