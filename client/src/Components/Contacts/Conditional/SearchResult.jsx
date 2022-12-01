import React, { useContext, useEffect, useState } from 'react'
import { currentChatContext } from '../../../Store/CurrentChat'
import { authContext } from '../../../Auth/AuthContext'
import { getAllUsers } from '../../../Helpers/HelperFunctions'
import { checkSelectedChat } from '../../../Helpers/HelperFunctions'
import ContactSuggestion from '../Items/ContactSuggestion'

function SearchResult({ props }) {

    const { search } = props
    const { currentChat } = useContext(currentChatContext)
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
                            <ContactSuggestion props={{ index, contact, selectedSearchItem }} key={index} />
                        )
                    })
            }
        </div>
    )
}

export default SearchResult