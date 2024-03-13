import { randomUUID } from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js';



const dateNow = new Date();
const database = new Database()
export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req,res) => {
      const task = database.select('tasks')

      return res.end(JSON.stringify(task))
    }
  },
  {
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req,res) => {
      const { title, description } = req.body

      if(title == ""|| description == "" ){
        return res.writeHead(404, "ERROR")
        .end(JSON.stringify({Status: 404, mensagem: "Informação de title ou description não enviada"}))
      }

      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        reated_at: dateNow.toLocaleString(),
        updated_at: dateNow.toLocaleString()
      }
  
      database.insert('tasks', task)

      return res.writeHead(201).end()
    }

  },
  {
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req,res) => {
      const { title, description } = req.body
      const { id } = req.params

      const resultId = database.validatedId('tasks', id)
      if(resultId){
        return res.writeHead(404, "ERROR")
        .end(JSON.stringify(resultId))
      }

      if(title == ""|| description == "" ){
        return res.writeHead(404, "ERROR")
        .end(JSON.stringify({Status: 404, mensagem: "Informação de title ou description não enviada"}))
      }

      const task = {
        title,
        description,
        updated_at: dateNow.toLocaleString()
      }
  
      database.edit('tasks', task, id)

      return res.writeHead(201).end()
    }

  },
  {
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler:(req,res) => {
      const {id} = req.params 

      const resultId = database.validatedId('tasks', id)
      if(resultId){
        return res.writeHead(404, "ERROR")
        .end(JSON.stringify(resultId))
      }

      database.delete('tasks', id)
      return res.writeHead(204).end()
    }
    
  },
  {
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id'),
    handler: (req,res) => {
      const { id } = req.params

      const resultId = database.validatedId('tasks', id)
      if(resultId){
        return res.writeHead(404, "ERROR")
        .end(JSON.stringify(resultId))
      }

      database.idCompleted('tasks', id)

      return res.writeHead(201).end()
    }

  }
]