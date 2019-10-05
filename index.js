require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
//const mongoose = require('mongoose')
const Person = require('./models/person')

app.use(express.static('build'))
app.use(bodyParser.json())
app.use(cors())

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

app.use(requestLogger)

/*
const url =
    `mongodb+srv://fullstack:${password}@cluster0-r04lb.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})


personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
  }
})
*/
morgan.token('body', (request) => {
  return (
    JSON.stringify(request.body)
    
  )
}
)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
/*app.use(morgan("tiny"))


let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4
  }
]*/

function addZero(n) {
  return (n < 10 ? '0' : '') + n
}

const d = new Date()
const currentdate = (d.toLocaleString('en-us', { weekday: 'long' }).substr(0, 3) + ' ' + d.toLocaleDateString('en-us', { month: 'long' }).substr(0, 3) + ' ' + addZero(d.getDate()) + ' ' + d.getFullYear() + ' ' + addZero(d.getHours()) + ':' + addZero(d.getMinutes()) + ':' + addZero(d.getSeconds()) + ' GMT+0' + ((d.getTimezoneOffset()) / 60) * -1 + '00 (EEST)')
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    //response.json(persons)
    response.json(persons.map(p => p.toJSON()))
  })
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send('<p>Phonebook has info for ' + JSON.stringify(persons.length) + ' people</p><p>' + currentdate + '</p>')
  })
})

/*app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})*/

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person.toJSON())
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})


/*app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log("poistetaan henkilö id:llä " + id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})*/

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  /*lif (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  et exists = persons.filter(person => person.name === body.name)
  if (exists.length > 0) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.id,
    id: Math.floor(Math.random() * 1000) + 5
  }*/
  const person = new Person({
    name: body.name,
    number: body.number
  })


  //persons = persons.concat(person)
  //response.json(person)
  person.save()
    .then(savedPerson => {
      response.json(savedPerson.toJSON())
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number
  }
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

//const PORT = process.env.PORT || 3001
const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})