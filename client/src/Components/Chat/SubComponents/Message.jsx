import React from 'react'

function Message({ messageObj }) {
    return (
        <div className={messageObj.isYours ? "sendedMessageContainer" : "recievedMessageContainer"}>
            <div className="message">
                <span>{messageObj.message}</span>
                <span className='sended-time' >{messageObj.time}</span>
            </div>
        </div>
    )
}

export default Message