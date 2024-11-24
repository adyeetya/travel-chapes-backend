import mongoose from 'mongoose'

// Function to connect to MongoDB with retry logic
const connectToMongodb = async () => {
  const mongoUri = process.env.MONGO_URI

  if (!mongoUri) {
    console.error('MongoDB URI is not defined in the environment variables.')
    return
  }

  const connectWithRetry = async (retries = 5) => {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 60000, // 30 seconds
      })
      console.log('Connected to MongoDB')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error.message)
      if (retries > 0) {
        console.log(`Retrying connection... (${retries} retries left)`)
        setTimeout(() => connectWithRetry(retries - 1), 5000) // Retry after 5 seconds
      } else {
        console.error('Failed to connect to MongoDB after multiple attempts.')
      }
    }
  }

  connectWithRetry()
}

// Listen for connection events
mongoose.connection.on('error', (err) => {
  console.error('Mongoose connection error:', err)
})

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB connection lost. Attempting to reconnect...')
  connectToMongodb() // Try to reconnect on disconnection
})

export default connectToMongodb
