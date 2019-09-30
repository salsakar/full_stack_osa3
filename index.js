const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(express.static('build'))
app.use(cors())


morgan.token('body', (request) => {
  return (
    JSON.stringify(request.body)
  )
}
)
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
//app.use(morgan("tiny")) 
app.use(bodyParser.json())

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
]

function addZero(n) {
  return (n < 10 ? '0' : '') + n;
}

const d = new Date()
const currentdate = (d.toLocaleString('en-us', { weekday: 'long' }).substr(0, 3) + ' ' + d.toLocaleDateString('en-us', { month: 'long' }).substr(0, 3) + ' ' + addZero(d.getDate()) + ' ' + d.getFullYear() + ' ' + addZero(d.getHours()) + ':' + addZero(d.getMinutes()) + ':' + addZero(d.getSeconds()) + ' GMT+0' + ((d.getTimezoneOffset()) / 60) * -1 + '00 (EEST)')
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request, response) => {

  response.send('<p>Phonebook has info for ' + JSON.stringify(persons.length) + ' people</p><p>' + currentdate + '</p>')
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log("poistetaan henkilö id:llä " + id)
  persons = persons.filter(person => person.id !== id)
  response.status(204).end()
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  else if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }
  let exists = persons.filter(person => person.name === body.name)
  if (exists.length > 0) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.id,
    id: Math.floor(Math.random() * 1000) + 5
  }
  persons = persons.concat(person)
  response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})