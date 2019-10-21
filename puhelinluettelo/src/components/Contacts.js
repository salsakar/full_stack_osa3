import React from 'react'
const Contacts = ({ persons, searchChars, deletePerson}) => {
    let sc = ''
    console.log(searchChars)
    if(searchChars){
        sc = searchChars.toString().toLowerCase()
    }
    return( 
     persons.filter(person => person.name.toLowerCase().includes(sc))
            .map(person => <p key = {person.id}>{person.name} {person.number}<button onClick={() => {deletePerson(person)}}>delete</button></p>)
    )
}
export default Contacts