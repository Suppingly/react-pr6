import bcrypt from 'bcrypt'
import JWT from '../utils/jwt.js'
import { prisma } from '../app.js'

class AuthService {
  async register({ email, password, name }) {
    const hashed = await bcrypt.hash(password, 10)
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })
    return user
  }

  async login({ email, password }) {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      const error = new Error('User not found')
      error.status = 404
      throw error
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      const error = new Error('Invalid password')
      error.status = 401
      throw error
    }

    const token = JWT.signToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    return token
  }

  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })
    if (!user) {
      const error = new Error('User not found')
      error.status = 404
      throw error
    }
    return user
  }

  async getUsers() {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: { id: true, name: true },
    })
    return users
  }
}
export default new AuthService()