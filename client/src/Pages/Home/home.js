import React from 'react'
import Contacts from '../../Components/Contacts/Contacts'
import Chat from '../../Components/Chat/Chat'
import './home.css'

function home() {
  return (
    <div className='home-container' >
        <Contacts/>
        <Chat/>
    </div>
  )
}

export default home