import express from 'express'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import connectDB from './configs/db.js'
// import userRoutes from './routes/userRoutes.js'

// Load environment variables
dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(bodyParser.json())

// Routes
// app.use('/api/users', userRoutes)

// Basic Route
app.get('/', (req, res) => {
  res.send('API is running...')
})

// Start Server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
