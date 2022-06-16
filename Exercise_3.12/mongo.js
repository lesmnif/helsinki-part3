const mongoose = require('mongoose')

if(process.argv.length === 5){
    const password = process.argv[2]

    const url = `mongodb+srv://lesmnif:${password}@cluster0.zcpv1.mongodb.net/?retryWrites=true&w=majority`
    
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
                name: process.argv[3],
                number: process.argv[4],
            })
            console.log(person)
            return person.save() 
        })
        .then(() =>{
            console.log('person saved!')
            return mongoose.connection.close()
        })
        .catch((err) => console.log(err))
}
else if (process.argv.length === 3){
    const password = process.argv[2]

    const url = `mongodb+srv://lesmnif:${password}@cluster0.zcpv1.mongodb.net/?retryWrites=true&w=majority`
    
    const personSchema = new mongoose.Schema({
        name: String,
        number: Number,
        id: Number
    })
    
    
    
    const Person = mongoose.model('Person', personSchema )
    
    
    mongoose
        .connect(url)
        .then((result) =>{
            console.log('I\'m connected!')
            Person.find({}).then(result => {
                console.log('Phonebook:')
                result.forEach(note => {
                    console.log(note.name, note.number)
                })
                return mongoose.connection.close()
            })
        })
}
else{
    console.log('provide 3 parameters to see the phonebook or 5 to add a new person (4th parameter name and 5th number).')
    process.exit(1)
}