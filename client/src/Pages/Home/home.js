import React,{ useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import Contacts from '../../Components/Contacts/Contacts'
import Chat from '../../Components/Chat/Chat'
import './home.css'

function Home({user}) {
  const navigate = useNavigate()
  useEffect(() => {
    if(!user){
      navigate('/login')
    }else {
      console.log(user)
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