import React, { useContext, useEffect } from 'react'
import InputField from '../../InputField/InputField'
import { currentChatContext } from '../../../Store/CurrentChat'
import { chatHelper } from '../../../Helpers/ChatHelper'
import { confirmAlert } from 'react-confirm-alert'; // Import alert npm
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css for alert

function InputBox({ props }) {

    const { handleMessageSubmit, message, setMessage, setBlocked, blocked, onlineStatus } = props
    const { currentChat } = useContext(currentChatContext)
    const { unblockChat } = useContext(chatHelper)

    const messageSubmitHelper = (e) => {
        e.preventDefault()
        if (!blocked) {
            handleMessageSubmit({ message, setMessage })
        } else {
            confirmAlert({
                // title: 'Logout',
                message: 'unblock to send messages',
                buttons: [
                    {
                        label: 'Cancel',
                        onClick: () => {

                        }
                    },
                    {
                        label: 'Unblock',
                        onClick: () => {
                            unblockChat(currentChat._id).then(() => {
                                setBlocked(false)
                            })
                        }
                    }
                ]
            })
        }
    }

    useEffect(() => {
        if(currentChat) {
            setMessage("")
        }
    }, [currentChat])
    

    return (
        <div className="Input-Box">
            <div className="inputfield-container">
                <form onSubmit={messageSubmitHelper} >
                    <InputField
                        type="text"
                        value={message}
                        name="message"
                        placeholder="type something..."
                        className="Chat-Inupt"
                        onChangeFunction={setMessage}
                    />
                </form>
            </div>
        </div>
    )
}

export default InputBox