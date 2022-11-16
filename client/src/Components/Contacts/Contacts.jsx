import React, { useContext, useEffect, useState } from 'react'
import './Contacts.css'
import { authContext } from '../../Auth/AuthContext'
import { contactListContext } from '../../Store/ContactList'
import InputField from '../InputField/InputField'
import ContactList from './SubComponents/ContactList'
import SearchResult from './SubComponents/SearchResult'
import { getContactList } from '../../Helpers/HelperFunctions'
import {authHelpers} from '../../Auth/AuthHelpers'


function Contacts() {

  const { user } = useContext(authContext)
  const { contactsList, setContactsList } = useContext(contactListContext)
  const { logout } = useContext(authHelpers)
  const [ search, setSearch ] = useState()

  useEffect(() => {
    user && getContactList(user._id).then((List) => {
      setContactsList(List)
    })
  }, [user])

  const logoutHelper = () => {
    logout()
  }

  const ContactlistSection = search ? <SearchResult props={{ search }} /> : <ContactList props={{ contactsList }} />

  return (
    <div className='contacts-container'>

      <div className="profileBand">
        <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA7ECizMinUV4oPQG6BUFIZZmeXehbj7pytQ&usqp=CAU" alt="person" />
        {user && <span>{user.FullName}</span>}
        <button onClick={logoutHelper} >Logout</button>
      </div>

      <div className="contacts-searchBox">
        <InputField
          type="search"
          name="search"
          placeholder="Search..."
          className="search"
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