import React, { useContext } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat'
import { contactListContext } from '../../../Store/ContactList'

function SearchResult({ props }) {

    const { search } = props
    const { setCurrentChat, currentChat } = useContext(currentChatContext)
    const { allUsers} = useContext(contactListContext)

    let selectedSearchItem = false

    return (
        <div>
            {
                allUsers.filter(contact => contact.FullName.toLowerCase().startsWith(search.toLowerCase()) || contact.UserName.toLowerCase().startsWith(search.toLowerCase()))
                    .map((contact, index) => {
                        if (currentChat && contact._id === currentChat._id) {
                            selectedSearchItem = true
                        } else {
                            selectedSearchItem = false
                        }
                        return (
                            <div key={index}
                                onClick={() => {
                                    setCurrentChat(contact)
                                }}
                                className={selectedSearchItem ? "selected-search-contact-item" : "search-contact-item"}
                            >
                                <span className='search-contactName'>{contact.FullName}</span>
                                <span className='userName' >{contact.UserName}</span>
                            </div>
                        )
                    })
            }
        </div>
    )
}

export default SearchResult