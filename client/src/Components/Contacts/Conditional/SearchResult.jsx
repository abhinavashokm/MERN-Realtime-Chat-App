import React, { useContext, useEffect, useState } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat'
import { authContext } from '../../../Auth/AuthContext'
import { getAllUsers } from '../../../Helpers/HelperFunctions'
import { checkSelectedChat } from '../../../Helpers/HelperFunctions'

function SearchResult({ props }) {

    const { search } = props
    const { setCurrentChat, currentChat } = useContext(currentChatContext)
    const { user } = useContext(authContext)

    const [allUsers, setAllUsers] = useState([])

    useEffect(() => {
        user && getAllUsers(user._id).then((allUsers) => {
            setAllUsers(allUsers)
        })
    }, [user])

    return (
        <div className='Contact-List' >
            {
                allUsers.filter(contact => contact.FullName.toLowerCase().startsWith(search.toLowerCase()) || contact.UserName.toLowerCase().startsWith(search.toLowerCase()))
                    .map((contact, index) => {

                        const selectedSearchItem = currentChat && checkSelectedChat(contact._id, currentChat._id)

                        return (
                            <div
                                key={index}
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
                    })
            }
        </div>
    )
}

export default SearchResult