import React from 'react'
import './Contacts.css'

function contacts() {
  return (
    <div className='contacts-container' >
      <div className="profileBand">
        <img  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA7ECizMinUV4oPQG6BUFIZZmeXehbj7pytQ&usqp=CAU" alt="person" />
        <span>Abhinav</span>
      </div>
      <div className='contact-list'>
        <div className="contact-item">
          <span className='contactName'>John</span>
        </div>
        <div className="contact-item">
          <span className='contactName'>Nick</span>
        </div>
        <div className="contact-item">
          <span className='contactName'>Duck</span>
        </div>
      </div>
    </div>
  )
}

export default contacts