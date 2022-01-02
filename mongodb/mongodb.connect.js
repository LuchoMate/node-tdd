const mongoose = require('mongoose')

async function connect(){
  //enter credentials
  const creds = "admin:password"
  try {
    await mongoose.connect(`mongodb+srv://${creds}@cluster0.46hc8.mongodb.net/todo-tdd?retryWrites=true&w=majority`, 
    {useNewUrlParser: true})
  } catch (error) {
    console.log('error connecting to mongodb')
    console.log(error)
  }
  
}

module.exports = { connect }

