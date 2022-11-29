import React, { useContext, useState, useEffect } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat'
import { contactListContext } from '../../../Store/ContactList'
import { chatHelper } from '../../../Helpers/ChatHelper'
import { isBlockedContact } from '../../../Helpers/HelperFunctions'

function Header({ props }) {

    const { onlineStatus, blocked, setBlocked } = props
    const { currentChat } = useContext(currentChatContext)
    const { removeChat, blockChat, unblockChat, isAlreadyInContactList } = useContext(chatHelper)
    const { contactsList, blockedList } = useContext(contactListContext)
    const [alreadyInChat, setAlreadyInChat] = useState(false)

    const removeChatHelper = () => {
        removeChat(currentChat._id)
    }
    const blockChatHelper = () => {
        blockChat({ _id: currentChat._id, FullName: currentChat.FullName }).then(() => {
            setBlocked(true)
        })
    }
    const unblockChatHelper = () => {
        unblockChat(currentChat._id).then(() => {
            setBlocked(false)
        })
    }
    useEffect(() => {
        isAlreadyInContactList(currentChat._id).then((res) => {
            setAlreadyInChat(res)
        })
        isBlockedContact(blockedList, currentChat._id).then((res) => {
            setBlocked(res)
        })
    }, [alreadyInChat, currentChat, blocked])



    return (
        <div className="chat-header">

            <div className="chat-details">
                {currentChat && <span className='person-name'>{currentChat.FullName}</span>}
                {blocked ?

                    <span className='status-blocked' >You Blocked This Person</span>

                    : <span className={onlineStatus ? 'status-online' : 'status-offline'} >
                        {onlineStatus ? "Online" : "last seen on "}
                        {onlineStatus ? "" : <span className='last-seen' >{currentChat.LastSeen}</span>}
                    </span>
                }
            </div>

            {
                alreadyInChat &&
                <div className="dropdown-container" tabIndex="1">
                    <div className='three-dots-container' >
                        <div className="three-dots"></div>
                    </div>
                    <div className="dropdown">
                        <div onClick={removeChatHelper}><span>Remove</span></div>
                        {blocked ?
                            <div onClick={unblockChatHelper} ><span>Unblock</span></div>
                            :
                            <div onClick={blockChatHelper} ><span>Block</span></div>
                        }
                    </div>
                </div>
            }

        </div >
    )
}

export default Header