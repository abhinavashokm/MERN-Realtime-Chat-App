import React from 'react'
import "./Chat.css"
import styled from 'styled-components'

const Mess = styled.div`
display: flex;
margin: 5px 15px;
justify-content: ${props => props.isYours ? "flex-end" : "flex-start"} ;
`

function Chat() {
  return (
    <div className='chat-container'>
      <div className="chat-header">
        <span>John</span>
      </div>
      <div className="messages-container">
        <Mess isYours={true}>
          <div className="message">
            hai man
          </div>
        </Mess>
        <Mess isYours={false}>
          <div className="message">
            hai man
          </div>
        </Mess>
      </div>
      <div className="chatBox">
        <div className="chatbox-container">
          <input className="chat-input" type="text" placeholder='type something...' />
        </div>
      </div>
    </div>
  )
}

export default Chat