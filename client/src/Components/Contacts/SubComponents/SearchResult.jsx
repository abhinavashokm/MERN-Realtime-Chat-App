import React from 'react'

function SearchResult({ props }) {

    const { contactsList, search } = props

    return (
        <div>
            {
                contactsList.filter(contact => contact.FullName.toLowerCase().startsWith(search.toLowerCase()) )
                    .map((contact, index) => {
                        return (
                            <div key={index} className="contact-item" >
                                <span className='contactName'>{contact.FullName}</span>
                            </div>
                        )
                    })
            }
        </div>
    )
}

export default SearchResult