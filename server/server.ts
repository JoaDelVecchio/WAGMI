import express from 'express'
import { PORT } from './config'
import ConnectDB from './config/data'
import cors from 'cors'
import authRouter from './routes/authRoutes'

const app = express()

//Connect to MongoDB
ConnectDB()

//CORS POLICY
app.use(cors())

//MIDDLEWARE PARSER
app.use(express.json())

app.use('/api/auth',authRouter)

app.listen(PORT,()=>{console.log('Server running on port',PORT)})