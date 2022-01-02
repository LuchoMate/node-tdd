const todoController = require('../../controllers/todoController')
const TodoModel = require('../../model/todo.model')
const httpMocks = require('node-mocks-http')
const newTodo = require('../mock-data/new-todo.json')
const allTodos = require('../mock-data/all-todos.json')

// TodoModel.create = jest.fn()
// TodoModel.find = jest.fn()
// TodoModel.findById = jest.fn()
// TodoModel.findByIdAndUpdate = jest.fn()
// TodoModel.findByIdAndDelete = jest.fn()
jest.mock('../../model/todo.model')

const todoId = '61d0af49859b1c3873aba6d2'

let req, res, next;
beforeEach(() => {
  req = httpMocks.createRequest()
  res = httpMocks.createResponse()
  next = jest.fn()
})

//*********************GET BY ID*/
describe('todoController.getTodoById', () => {
  it('should have a getTodoByIdFunction', () => {
    expect(typeof todoController.getTodoById).toBe('function')
  })
  it('should call findById with route params', async() => {
    req.params.todoId = '61d0acfc07153d90ad7593fb'
    await todoController.getTodoById(req, res, next)
    expect(TodoModel.findById).toBeCalledWith('61d0acfc07153d90ad7593fb')
  })
  it('should return json body and status 200', async () => {
    TodoModel.findById.mockReturnValue(newTodo)
    await todoController.getTodoById(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })
  it('should handle errors', async () => {
    const errorMessage = 'error getting todo by id'
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.findById.mockReturnValue(rejectedPromise)
    await todoController.getTodoById(req, res, next)
    expect(next).toBeCalledWith(errorMessage)
    
  })
  it('should return 404 if Id doesnt exist', async () => {
    TodoModel.findById.mockReturnValue(null)
    await todoController.getTodoById(req, res, next)
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
  })
})

//*********************GET ALL */
describe('todoController.getTodos', () => {
  it('should have a getTodos function', () => {
    expect(typeof todoController.getTodos).toBe('function')
  })
  it('should call TodoModel.find({})', async () => {
    await todoController.getTodos(req, res, next)
    expect(TodoModel.find).toHaveBeenCalledWith({})
  })
  it('should return response 200 and all todos', async () => {
    TodoModel.find.mockReturnValue(allTodos)
    await todoController.getTodos(req, res, next)
    expect(res.statusCode).toBe(200)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(allTodos)
  })
  it('should handle errors', async () => {
    const errorMessage = 'error getting todos'
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.find.mockReturnValue(rejectedPromise)
    await todoController.getTodos(req,res, next)
    expect(next).toBeCalledWith(errorMessage)
  })
})

//********************POST */
describe('todoController.createTodo', () => {
  beforeEach(() => {
    req.body = newTodo
  })
  it('should have a createTodo function', () => {
    expect(typeof todoController.createTodo).toBe('function')
  })
  it('should call todoModel.create', () => {
    todoController.createTodo(req, res, next)
    expect(TodoModel.create).toBeCalledWith(newTodo)
  })
  it('should return 201 res code', async() => {
    await todoController.createTodo(req, res, next)
    expect(res.statusCode).toBe(201)
    expect(res._isEndCalled()).toBeTruthy()
  })
  it('should return json body', async () => {
    TodoModel.create.mockReturnValue(newTodo)
    await todoController.createTodo(req,res, next)
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })
  it('should handle errors', async () => {
    const errorMessage = 'property missing'
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.create.mockReturnValue(rejectedPromise)
    await todoController.createTodo(req,res, next)
    expect(next).toBeCalledWith(errorMessage)

  })
})

/**************PUT */
describe('todoController.updateTodo', () => {
  it('should have a updateTodo function', () => {
    expect(typeof todoController.updateTodo).toBe('function')
  })
  it('should update with todomodel.findbyidandupdate', async () => {
    req.params.todoId = todoId
    req.body = newTodo
    await todoController.updateTodo(req, res, next)
    expect(TodoModel.findByIdAndUpdate).toHaveBeenCalledWith(todoId, newTodo, {new: true, useFindAndModify: false})
  })
  it('should send response back with json data and code 200', async () => {
    req.params.todoId = todoId//not necessary, mock will return data regardless
    req.body = newTodo
    TodoModel.findByIdAndUpdate.mockReturnValue(newTodo)
    await todoController.updateTodo(req, res, next)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res.statusCode).toBe(200)
    expect(res._getJSONData()).toStrictEqual(newTodo)
  })
  it('should handle errors', async () => {
    const errorMessage = 'couldnt find and update'
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.findByIdAndUpdate.mockReturnValue(rejectedPromise)
    await todoController.updateTodo(req, res, next)
    expect(next).toBeCalledWith(errorMessage)
  })
  it('should return 404 code if Id doesnt exist', async () => {
    TodoModel.findByIdAndUpdate.mockReturnValue(null)
    await todoController.updateTodo(req, res, next)
    expect(res.statusCode).toBe(404)
    expect(res._isEndCalled()).toBeTruthy()
  })
})

/*******************DELETE */


describe('todoController.deleteTodo', () => {
  it('should have a deleteTodo function', () => {
    expect(typeof todoController.deleteTodo).toBe('function')
  })
  
 it('should delete with todoModel.deleteTodo', async () => {
   req.params.todoId = todoId
   await todoController.deleteTodo(req, res, next)
   expect(TodoModel.findByIdAndDelete).toHaveBeenCalledWith(todoId)
 })

  it('should response back with json data and code 200', async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(newTodo)
    await todoController.deleteTodo(req, res, next)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res._getJSONData()).toStrictEqual(newTodo)
    expect(res.statusCode).toBe(200)
  })

  it('should handle errors', async () => {
    const errorMessage = 'couldnt delete todo'
    const rejectedPromise = Promise.reject(errorMessage)
    TodoModel.findByIdAndDelete.mockReturnValue(rejectedPromise)
    await todoController.deleteTodo(req, res, next)
    expect(next).toBeCalledWith(errorMessage)
  })

 it('should return 404 if id doesnt exist', async () => {
    TodoModel.findByIdAndDelete.mockReturnValue(null)
    await todoController.deleteTodo(req, res, next)
    expect(res._isEndCalled()).toBeTruthy()
    expect(res.statusCode).toBe(404)
 })
})