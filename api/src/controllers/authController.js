import authService from '../services/authService.js'
import JWT from '../utils/jwt.js'

class AuthController {
  async register(req, res, next) {
    try {
      const user = await authService.register(req.body)
      const token = await authService.login(req.body)

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 3600000*24,
        path: '/',
      })

      res.status(201).json({ data: user, error: null })
    } catch (error) {
      next(error)
    }
  }

  async login(req, res, next) {
    try {
      const token = await authService.login(req.body)

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 3600000*24,
        path: '/',
      })

      res.status(200).json({ data: { message: 'Вход успешен' }, error: null })
    } catch (error) {
      next(error)
    }
  }

  async getProfile(req, res, next) {
    try {
      const token = req.cookies.token

      if (!token) {
        return res.status(401).json({ data: null, error: { message: 'Не авторизован' } })
      }

      const decoded = JWT.verifyToken(token)
      const user = await authService.getUserById(decoded.id)

      res.status(200).json({ data: user, error: null })
    } catch (error) {
      next(error)
    }
  }

  async checkToken(req, res, next) {
    try {
      const token = req.cookies.token
      if (!token) {
        res.status(401).json({ data: null, error: { message: 'Не авторизован' } })
      } else {
        res.status(200).json({ data: { ok: true }, error: null })
      }
    } catch (error) {
      next(error)
    }
  }

  async logout(req, res, next) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        path: '/',
      })
      res.status(200).json({ data: { message: 'Выход выполнен' }, error: null })
    } catch (error) {
      next(error)
    }
  }

  async getUsers(req, res, next) {
    try {
      const users = await authService.getUsers()
      res.status(200).json({ data: users, error: null })
    } catch (error) {
      next(error)
    }
  }
}

export default new AuthController()
