import express from 'express'
import dotenv from 'dotenv'
dotenv.config({path:'../../.env'})

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
const password= process.env.DB_PASSWORD
console.log("Connecting to database")
console.log("test")


