import React from 'react'
const Filter = ({ handleSearch, searchChars }) => {
  return (
    <div>
      <form>
        filter shown with:  <input value={searchChars}
          onChange={handleSearch}
        />
      </form>
    </div>
  )
}
export default Filter