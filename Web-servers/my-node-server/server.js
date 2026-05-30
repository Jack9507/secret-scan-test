import express from 'express'

const app = express()
const PORT = 8000

app.get("/", (req, res) => {
    res.send(JSON.parse('{"name":"jerry", "age":27}'))
})

const server = app.listen(PORT,()=>{
    console.log(`Server Running on PORT: ${PORT}`)
})

// console.log(server)
const username="admin"
const password=REMOVED_PASSWORD
console.log(`Connecting to database with username: ${username} and password: ${password}`)


