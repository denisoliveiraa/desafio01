import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf8')
      .then(data => {
        this.#database = JSON.parse(data)
      })
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table) {
    const data = this.#database[table] ?? []

    return data
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  edit(table, data, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex].title = data.title
      this.#database[table][rowIndex].description = data.description
      this.#database[table][rowIndex].updated_at = data.updated_at
      this.#persist()
    }
  }

  idCompleted(table,id){
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    if (rowIndex > -1) {
      this.#database[table][rowIndex].completed_at = "completed"
      this.#persist()
    }

  }

  validatedId(table, id){
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    if (rowIndex == -1) {
      const messageError = {
        code: 404,
        message: "Registro não encontrado"
      }
      return messageError
    }
  }
}