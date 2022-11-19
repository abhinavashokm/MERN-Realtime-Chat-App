import React from 'react'
import InputField from '../../InputField/InputField'

function SearchBox({props}) {

    const { setSearch } = props

    return (
        <div className="contacts-searchBox">
            <InputField
                type="search"
                name="search"
                placeholder="Search..."
                className="search"
                onChangeFunction={setSearch}
            />
        </div>
    )
}

export default SearchBox