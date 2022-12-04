import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Contacts from '../../Components/Contacts/Main/Contacts'
import Chat from '../../Components/Chat/Main/Chat'
import { currentChatContext } from '../../Store/CurrentChat'
import { authContext } from '../../Auth/AuthContext'
import { useMediaQuery } from 'react-responsive'
import './home.css'


function Home() {

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 576px)' })
  const isDesktop = useMediaQuery({ query: '(min-width: 577px)' })

  const { user } = useContext(authContext)
  const { currentChat } = useContext(currentChatContext)

  const navigate = useNavigate()
  useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  })

  return (
    <div className='home-container' >
      {((isDesktop) || (!currentChat && isTabletOrMobile)) && <Contacts />}
      {((isDesktop) || (currentChat && isTabletOrMobile)) && <Chat />}
    </div>
  )
}

export default Home