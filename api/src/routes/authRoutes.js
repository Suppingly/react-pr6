import express from 'express'
import authController from '../controllers/authController.js'
import { registerValidator, loginValidator } from '../middlewares/validate.js'

const router = express.Router()

router.post('/register', registerValidator, (req, res, next) =>
  authController.register(req, res, next),
)
router.post('/login', loginValidator, (req, res, next) =>
  authController.login(req, res, next),
)
router.get('/me', (req, res, next) => authController.getProfile(req, res, next))
router.get('/profile', (req, res, next) => authController.getProfile(req, res, next))
router.get('/profile/token', (req, res, next) => authController.checkToken(req, res, next))
router.post('/logout', (req, res, next) => authController.logout(req, res, next))
router.get('/profiles', (req, res, next) => authController.getUsers(req, res, next))

export default router