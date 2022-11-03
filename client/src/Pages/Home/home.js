import React, { useEffect, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import Contacts from '../../Components/Contacts/Contacts'
import Chat from '../../Components/Chat/Chat'
import { authContext } from '../../Auth/AuthContext'
import './home.css'

function Home() {

  const { user } = useContext(authContext)

  const navigate = useNavigate()
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  })

  return (
    <div className='home-container' >
      <Contacts />
      <Chat />
    </div>
  )
}

export default Home