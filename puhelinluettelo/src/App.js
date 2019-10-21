import React, { useState, useEffect } from 'react'
import Contacts from './components/Contacts'
import Addperson from './components/Addperson'
import Filter from './components/Filter'
import personsService from './services/persons'

const App = () => {

  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [searchChars, setSearchChars] = useState('')
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        console.log(response.data)
        setPersons(response.data)
      })
  }, [])


  const addName = (event) => {
    const personObject = {
      name: newName,
      number: newNumber
    }
    event.preventDefault()
    let existing = persons.filter(p => p.name === newName)

    if (existing.length > 0) {
      console.log(existing[0].id)
      if (window.confirm(newName + " is already added to the phonebook, replace the old number with a new one?")) {
        const updated = { ...existing[0], number: newNumber }
        personsService
          .update('/api/persons/' + existing[0].id, updated)
          .then(response => {
            setPersons(persons.map(person => person.id !== existing[0].id ? person : response.data))

            setMessage(existing[0].name + ' was updated')
            setTimeout(() => {
              setMessage(null)
            }, 3000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            setPersons(persons.filter(p => p.id !== existing[0].id))
            setError(
              existing[0].name + ' was already deleted'
            )
            setTimeout(() => {
              setError(null)
            }, 3000)
          })
      }
    }
    else {
      personsService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
          setMessage(personObject.name + ' was added')
          setTimeout(() => {
            setMessage(null)
          }, 2000)
        })
        .catch(error => {
          console.log(error.response.data.error)
          setError(error.response.data.error)
          setTimeout(() => {
            setError(null)
          }, 6000)
        })
    }
  }
  const deletePerson = (person) => {
    const url = '/api/persons/' + person.id + '?'
    if (window.confirm("Delete " + person.name)) {
      personsService
        .del(url)
        .then(response => {
          setPersons(persons.filter(p => p.id !== person.id))
          setMessage(person.name + ' was deleted')
          setTimeout(() => {
            setMessage(null)
          }, 2000)
        })

    }
  }

  const handleNameAdd = (event) => {
    setNewName(event.target.value)

  }
  const handleNumberAdd = (event) => {
    setNewNumber(event.target.value)
  }
  const handleSearch = (event) => {
    setSearchChars(event.target.value)
  }

  const Notification = ({ message, className }) => {
    if (message === null) {
      return null
    }

    return (
      <div className={className}>
        {message}
      </div>
    )
  }


  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} className="msg" />
      <Notification message={error} className="error" />
      <Filter searchChars={searchChars} handleSearch={handleSearch} />

      <h2>add a new</h2>
      <Addperson addName={addName} newName={newName} newNumber={newNumber} handleNameAdd={handleNameAdd} handleNumberAdd={handleNumberAdd} />

      <h2>Numbers</h2>
      <Contacts searchChars={searchChars} persons={persons} deletePerson={deletePerson} />

    </div>
  )
}

export default App