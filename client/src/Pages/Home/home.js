import React,{ useEffect, useContext } from 'react'
import {useNavigate} from 'react-router-dom'
import Contacts from '../../Components/Contacts/Contacts'
import Chat from '../../Components/Chat/Chat'
import { userContext } from '../../Store/UserContext'
import './home.css'

function Home() {
  const {user} = useContext(userContext)
  const navigate = useNavigate()
  useEffect(() => {
    if(!user){
      navigate('/login')
    }
  })
  
  return (
    <div className='home-container' >
        <Contacts/>
        <Chat/>
    </div>
  )
}

export default Home