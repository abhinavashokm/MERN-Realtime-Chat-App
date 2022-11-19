import React, { useContext, useEffect, useState } from 'react'
import './Contacts.css'
import { authContext } from '../../Auth/AuthContext'
import { contactListContext } from '../../Store/ContactList'
import { getContactList } from '../../Helpers/HelperFunctions'
import Profile from './Items/Profile'
import SearchBox from './Items/SearchBox'
import ContactList from './Conditional/ContactList'
import SearchResult from './Conditional/SearchResult'


function Contacts() {

  const { user } = useContext(authContext)
  const { setContactsList } = useContext(contactListContext)
  const [search, setSearch] = useState()

  useEffect(() => {
    user && getContactList(user._id).then((List) => {
      setContactsList(List)
    })
  }, [user])

  return (
    <div className='contacts-container'>

      <Profile />

      <SearchBox props={{ setSearch }} />

      {search ? <SearchResult props={{ search }} /> : <ContactList />}

    </div>
  )
}

export default Contacts