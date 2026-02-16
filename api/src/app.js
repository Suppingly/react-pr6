import express from 'express'
import { PrismaClient } from './generated/prisma/index.js'
import mediaRoutes from './routes/mediaRoutes.js'
import authRoutes from './routes/authRoutes.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()
export const prisma = new PrismaClient()

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
)

app.use(cookieParser())
app.use(express.json())

app.use('/api/media', mediaRoutes)
app.use('/api/auth', authRoutes)
app.use('/uploads', express.static('src/uploads'))

app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'Internal server error'
  res.status(status).json({ data: null, error: { message } })
})

export default app