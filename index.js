const { response } = require('express');
const { application } = require('express');
const express = require('express');
const { json } = require('express/lib/response');
const morgan = require('morgan')
const cors = require('cors')


const app = express()

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

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


app.use(cors())
morgan.token('body', function (req, res) { return JSON.stringify(req.body)  })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())
app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/info', (request,response) => {
  response.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  console.log(id)
  const note = persons.find(note => note.id === id)
  if (note){
    return  response.json(note)
  }
  response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) =>{
  const id = Number(request.params.id)
  persons = persons.filter(note => note.id !== id)
  console.log(persons)
  response.status(204).end()
})


app.post('/api/persons', (request, response) =>{
  const newId = getRandomArbitrary(persons.length, 1000 )
  const newPerson = request.body
  if(!newPerson.name || !newPerson.number){
    return response.status(400).send('<p>Fill the name and number field.</p>').end()
  }
  else if(persons.filter(person => person.name.toLowerCase() === newPerson.name.toLowerCase()).length === 1){
    return response.status(400).send('<p>Error: Name already exists.</p>').end()
  }
  newPerson.id = newId
  persons = persons.concat(newPerson)
  response.send(newPerson)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})