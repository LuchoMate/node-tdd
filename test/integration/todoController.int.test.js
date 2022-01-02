const request = require('supertest')
const app = require('../../app')
const newTodo = require('../mock-data/new-todo.json')

const endPointUrl = '/todos/'
let firstTodo
let lastTodoId
let lastTodoBody

describe(endPointUrl, () => {
  it('GET' + endPointUrl, async () => {
    const res = await request(app).get(endPointUrl)
    expect(res.statusCode).toBe(200)
    expect(Array.isArray(res.body)).toBeTruthy()
    expect(res.body[0].title).toBeDefined()
    expect(res.body[0].done).toBeDefined()
    firstTodo = res.body[0]

  })
  it('Get todo by Id '+ endPointUrl, async () => {
    const res = await request(app).get(endPointUrl + firstTodo._id)
    expect(res.statusCode).toBe(200)
    expect(res.body.title).toBe(firstTodo.title)
    expect(res.body.done).toBe(firstTodo.done)
  })
  it('Get todo by invalid Id' + endPointUrl, async () => {
    const res = await request(app).get(endPointUrl + '61d0acfc07153d90ad759377')
    expect(res.statusCode).toBe(404)
  })

  it('POST '+ endPointUrl, async () => {
    const res = await request(app).post(endPointUrl).send(newTodo)
    expect(res.statusCode).toBe(201)
    expect(res.body.title).toBe(newTodo.title)
    expect(res.body.done).toBe(newTodo.done)
    lastTodoId = res.body._id
  })

  it('should throw 500 on malformed data with POST ' +endPointUrl, async () => {
    const response = await request(app).post(endPointUrl).send({title: "missing done property"})
    expect(response.statusCode).toBe(500)
    expect(response.body).toStrictEqual({
      message: "Todo validation failed: done: Path `done` is required."
    })
  })

  it('PUT' + endPointUrl, async () => {
    const testData = {title: "PUT IT", done: true}
    const res = await request(app).put(endPointUrl + lastTodoId).send(testData)
    expect(res.statusCode).toBe(200)
    expect(res.body.title).toBe(testData.title)
    expect(res.body.done).toBe(testData.done)
    lastTodoBody = res.body
  })

  it('DELETE '+ endPointUrl, async () => {
    const res = await request(app).delete(endPointUrl + lastTodoId)
    expect(res.statusCode).toBe(200)
    expect(res.body.title).toBe(lastTodoBody.title)
    expect(res.body.done).toBe(lastTodoBody.done)
  })
  it('DELETE 404', async () => {
    const res = await request(app).delete(endPointUrl + '61d0af49859b1c3873aba5f1')
    expect(res.statusCode).toBe(404)
  })
})
