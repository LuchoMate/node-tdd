const { update } = require('../model/todo.model')
const TodoModel = require('../model/todo.model')

exports.createTodo = async (req, res, next) => {
  try {
    const createdModel = await TodoModel.create(req.body)
    res.status(201).json(createdModel)
  } catch (error) {
    next(error)
  }
}

exports.getTodos = async (req, res, next) => {

  try {
    const allTodos = await TodoModel.find({})
    res.status(200).json(allTodos)
  } catch (error) {
    next(error)
    
  } 
}

exports.getTodoById = async (req, res, next) => {
  try {
    const todoById = await TodoModel.findById(req.params.todoId)
    todoById ? res.status(200).json(todoById) : res.status(404).send()
    
  } catch (error) {
    next(error)
  }
}

exports.updateTodo = async (req, res, next) => {
  try {
    const updatedTodo = await TodoModel.findByIdAndUpdate(req.params.todoId, req.body, {new: true, useFindAndModify: false})
    updatedTodo ? res.status(200).json(updatedTodo): res.status(404).send()
  } catch (error) {
    next(error)
  }
}

exports.deleteTodo = async (req, res, next) => {
  try {
    const deletedTodo = await TodoModel.findByIdAndDelete(req.params.todoId)
    deletedTodo ? res.status(200).json(deletedTodo) : res.status(404).send()
  } catch (error) {
    next(error)
  }
}