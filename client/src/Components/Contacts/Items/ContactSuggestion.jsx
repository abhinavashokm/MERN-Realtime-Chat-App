import React, { useContext } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat'

function ContactSuggestion({ props }) {
    const { contact, selectedSearchItem } = props
    const { setCurrentChat } = useContext(currentChatContext)
    return (
        <div
            onClick={() => {
                setCurrentChat(contact)
            }}
            className={selectedSearchItem ? "Suggestion-Contact-Selected" : "Suggestion-Contact"}
        >
            {
                selectedSearchItem ?
                    <img className='suggestion-contact-avatar-img' src="Images/selected-contact-avatar.png" alt="person" />
                    :
                    <img className='suggestion-contact-avatar-img' src="Images/contact-avatar.png" alt="person" />
            }

            <div className='Suggestion-Details-Container' >
                <span className='Suggestion-Name'>{contact.FullName}</span>
                <span className='Suggestion-UserName' >{contact.UserName}</span>
            </div>
        </div>
    )
}

export default ContactSuggestion