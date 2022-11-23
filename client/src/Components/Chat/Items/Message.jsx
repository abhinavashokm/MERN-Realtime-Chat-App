import React from 'react'


function Message({ messageObj }) {
    return (
        <div className={messageObj.isYours ? "sendedMessageContainer" : "recievedMessageContainer"}>
            <div className="message">
                <span>{messageObj.message}</span>

                <div className='msgDetails-Container' >

                    <span className='sended-time' >{messageObj.time}</span>

                    {messageObj.isYours &&
                        <span className='tick'>
                            {messageObj.seen === true ?
                                < svg className='blue-tick' width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076">
                                    <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7">
                                    </path>
                                </svg>
                                : messageObj.seen === "deliverd" ?
                                    <svg className='double-tick' width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076">
                                        <path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#808080">
                                        </path>
                                    </svg>
                                    :
                                    <img className='clock' src="Images/clock.png" alt="" /> 
                            }
                        </span>
                    }

                </div>

            </div>
        </div >
    )
}

export default Message