import express from 'express'
import { PORT } from './config'
import ConnectDB from './config/data'
import cors from 'cors'

const app = express()

//Connect to MongoDB
ConnectDB()

//CORS POLICY
app.use(cors())

//MIDDLEWARE PARSER
app.use(express.json())

app.listen(PORT,()=>{console.log('Server running on port',PORT)})