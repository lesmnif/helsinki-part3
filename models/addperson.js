require('dotenv').config()
const mongoose = require('mongoose')    
    
const url = process.env.MONGODB_URL
    
const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
    id: Number
})
    
    
    
const Person = mongoose.model('Person', personSchema )
    
    
mongoose
    .connect(url)
    .then((result) =>{
        const person = new Person({
            name: newPerson.name,
            number: newPerson.number,
            id: newPerson.id
        })
        console.log(person)
        return person.save() 
    })
    .then(() =>{
        console.log('person saved!')
        return mongoose.connection.close()
    })
    .catch((err) => console.log(err))

module.exports = mongoose.model('Person', personSchema)