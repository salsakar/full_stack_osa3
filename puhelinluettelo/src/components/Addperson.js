import React from 'react'
const Addperson = ({ addName, newName, newNumber, handleNumberAdd, handleNameAdd }) => {
  return (
    <div>
      <form onSubmit={addName}>
        Name:  <input value={newName}
          onChange={handleNameAdd}
        />
        <br />
        Number:  <input value={newNumber}
          onChange={handleNumberAdd}
        />
        <br />
        <button type="submit">add</button>
      </form>
    </div>
  )
}
export default Addperson