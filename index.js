require('dotenv').config()
const Person = require('./models/person')


const express = require('express')
const app = express()
app.use(express.json())

const cors = require('cors')
app.use(cors())

app.use(express.static('dist'))

var morgan = require('morgan')
app.use(morgan('tiny'))


morgan.token('data',(req, res) => JSON.stringify(req.body) )

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request, response) => {
    Person.find({}).then(notes => {
        response.json(notes)
      })
})

app.get('/info',(request, response) => {
    response.send(
        `<p>
        Phonebook has info for ${persons.length} persons
        <br/>
        ${new Date()}
        </p>`
    )
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    person 
        ? response.json(person) 
        : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

const postMorgan = morgan(':method :url :status :res[content-length] - :response-time ms :data')

app.post('/api/persons', postMorgan, (request, response) => { 
    const body = request.body
    
    if(!(body.name && body.number)){ 
        response.status(400)
        return response.json({
            error: 'name or number missing'
        })
    }
    if(persons.map(person => person.name).includes(body.name)) {
        response.status(400)
        return response.json({
            error: 'name already exists in phonebook'
        })
    }
    
    const person = {
        id: Math.floor(Math.random() * 100000),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
