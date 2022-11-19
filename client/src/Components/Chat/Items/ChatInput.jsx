import React from 'react'
import InputField from '../../InputField/InputField'

function ChatInput({ props }) {

    const { handleMessageSubmit, message, setMessage } = props
    
    const messageSubmitHelper = (e) => {
        e.preventDefault()
        handleMessageSubmit({ message, setMessage })
    }

    return (
        <div className="chatBox">
            <div className="chatbox-container">
                <form onSubmit={messageSubmitHelper} >
                    <InputField
                        type="text"
                        value={message}
                        name="message"
                        placeholder="type something..."
                        className="chat-input"
                        onChangeFunction={setMessage}
                    />
                </form>
            </div>
        </div>
    )
}

export default ChatInput