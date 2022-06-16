require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const app = express()

const errorHandler = (error, request, response, next) => {
    console.error('Handling error', error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    }

    next(error)
}
function addPersonita(newPerson) {
    const url = process.env.MONGODB_URL
    console.log(newPerson)
    const Person = mongoose.model('Person')

    return mongoose
        .connect(url)
        .then(() => {
            const person = new Person({
                name: newPerson.name,
                number: newPerson.number,
            })
            console.log(person)
            return person.save()
        })
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min
}

const persons = require('./models/person')
const { response } = require('express')

app.use(cors())
app.use(express.static('build'))
morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})
app.use(
    morgan(':method :url :status :res[content-length] - :response-time ms :body')
)
app.use(express.json())
app.use(errorHandler)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
    persons.find({}).then((persons) => {
        response.json(persons)
    })
})

app.get('/info', (request, response) => {
    response.send(
        `<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`
    )
})

app.get('/api/persons/:id', (request, response, next) => {
    persons
        .findById(request.params.id)
        .then((note) => {
            if (note) {
                response.json(note)
            } else {
                response.status(404).end()
            }
        })
        .catch((error) => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    console.log(id)
    persons
        .findByIdAndRemove(id)
        .then((result) => {
            response.send(result)
            response.status(204).end()
        })
        .catch((error) => next(error))
})

app.post('/api/persons', (request, response, next) => {
    const newPerson = request.body
    // if(!newPerson.name || !newPerson.number){
    //   return response.status(400).send('<p>Fill the name and number field.</p>').end()
    // }
    // else if(persons.filter(person => person.name.toLowerCase() === newPerson.name.toLowerCase()).length === 1){
    //   return response.status(400).send('<p>Error: Name already exists.</p>').end()
    // }
    addPersonita(newPerson)
        .then(() => response.send(newPerson))
        .catch(error => next(error))
})
app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
    const id = request.params.id
    persons
        .findByIdAndUpdate(
            id,
            { name, number },
            { runValidators: true, context: 'query' }
        )
        .then((person) => {
            response.json(person)
        })
        .catch((error) => next(error))
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
