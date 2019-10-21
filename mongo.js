const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const personName = process.argv[3]
const personNumber = process.argv[4]

const url =
    `mongodb+srv://fullstack:${password}@cluster0-r04lb.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('persons', personSchema)

const person = new Person({
  name: personName,
  number: personNumber
})

if (!personName || !personNumber) {
  console.log('')
  console.log('phonebook:')
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person.name, person.number)
    })
    console.log('')
    mongoose.connection.close()
  })
}
else if (personName && personNumber) {
  person.save().then(response => {
    console.log('person saved!')
    mongoose.connection.close()
  })
}