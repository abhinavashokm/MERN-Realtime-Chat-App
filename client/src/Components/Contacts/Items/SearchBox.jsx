import React from 'react'
import InputField from '../../InputField/InputField'

function SearchBox({props}) {

    const { setSearch } = props

    return (
        <div className="SearchBox">
            <InputField
                type="search"
                name="search"
                placeholder="Search..."
                className="inputField"
                onChangeFunction={setSearch}
            />
        </div>
    )
}

export default SearchBox