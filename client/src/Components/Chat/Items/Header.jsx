import React, { useContext, useState, useEffect } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat'
import { contactListContext } from '../../../Store/ContactList'
import { chatHelper } from '../../../Helpers/ChatHelper'
import { isAlreadyInContactList } from '../../../Helpers/HelperFunctions'

function Header({ props }) {

    const { onlineStatus } = props
    const { currentChat } = useContext(currentChatContext)
    const { removeChat } = useContext(chatHelper)
    const { contactsList } = useContext(contactListContext)
    const [alreadyInChat, setAlreadyInChat] = useState(false)

    const removeChatHelper = () => {
        removeChat(currentChat._id)
    }
    useEffect(() => {
        isAlreadyInContactList(contactsList, currentChat._id).then((res) => {
            setAlreadyInChat(res)
        })
    }, [alreadyInChat, currentChat])



    return (
        <div className="chat-header">

            <div className="chatDetails">
                {currentChat && <span className='person-name'>{currentChat.FullName}</span>}

                <span className={onlineStatus ? 'status-online' : 'status-offline'} >
                    {onlineStatus ? "Online" : "last seen on "}
                    {onlineStatus ? "" : <span className='last-seen' >{currentChat.LastSeen}</span>}
                </span>
            </div>

            {alreadyInChat &&
                <div className="dropdown-container" tabIndex="1">
                    <div className='three-dots-container' >
                        <div className="three-dots"></div>
                    </div>
                    <div className="dropdown">
                        <div onClick={removeChatHelper}><span>Remove</span></div>
                        <div><span>Block</span></div>
                    </div>
                </div>
            }

        </div>
    )
}

export default Header