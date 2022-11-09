import React, { useContext, useEffect, useState } from 'react'
import './Contacts.css'
import axios from 'axios'
import { authContext } from '../../Auth/AuthContext'
import { currentChatContext } from '../../Store/CurrentChat'
import { contactListContext } from '../../Store/ContactList'
import { confirmAlert } from 'react-confirm-alert'; // Import alert npm
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css for alert
import InputField from '../InputField/InputField'
import SavedContacts from './SubComponents/SavedContacts'
import SearchResult from './SubComponents/SearchResult'


function Contacts() {

  const { user, setUser, socket } = useContext(authContext)
  const { setCurrentChat } = useContext(currentChatContext)
  const { contactsList, setContactsList, setAllUsers } = useContext(contactListContext)

  const [search, setSearch] = useState()

  useEffect(() => {
    if (user) {
      axios.post("http://localhost:3001/getContactList", { userId: user._id }).then((res) => {
        if (!res.data) {
          console.log("something went wrong")
        } else {
          let contacts = res.data.filter(contact => contact._id !== user._id)
          setContactsList(contacts)
        }
      })
    }
  }, [user])

  useEffect(() => {
    axios.get("http://localhost:3001/getAllContacts").then((res) => {
        if (!res.data) {
            console.log("something went wrong")
        } else {
            if (user) {
                let contacts = res.data.filter(contact => contact._id !== user._id)
                setAllUsers(contacts)
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

  const ContactlistSection = search ? <SearchResult props={{ search }} /> : <SavedContacts props={{ contactsList }} />

  return (
    <div className='contacts-container'>

      <div className="profileBand">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA7ECizMinUV4oPQG6BUFIZZmeXehbj7pytQ&usqp=CAU" alt="person" />
        {user && <span>{user.FullName}</span>}
        <button onClick={logoutUser} >Logout</button>
      </div>

      <div className="contacts-searchBox">
        <InputField
          type="search"
          name="search"
          placeholder="Search..."
          className="search"
          value={search}
          onChangeFunction={setSearch}
        />
      </div>

      <div className='contact-list'>
        {ContactlistSection}
      </div>

    </div>
  )
}

export default Contacts