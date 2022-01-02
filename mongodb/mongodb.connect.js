const mongoose = require('mongoose')

async function connect(){
  try {
    await mongoose.connect('mongodb+srv://admin1:vbnm1914@cluster0.46hc8.mongodb.net/todo-tdd?retryWrites=true&w=majority', 
    {useNewUrlParser: true})
  } catch (error) {
    console.log('error connecting to mongodb')
    console.log(error)
  }
  
}

module.exports = { connect }

