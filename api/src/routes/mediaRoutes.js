import { Router } from 'express'
import mediaController from '../controllers/mediaController.js'
import { authMiddlewareAlt } from '../middlewares/authMiddleware.js'
import { uploadMedia } from '../middlewares/uploadMedia.js'

const router = Router()

router.post('/', authMiddlewareAlt, uploadMedia.single('file'), mediaController.create)
router.get('/', authMiddlewareAlt, mediaController.getAllByUser)
router.get('/all', authMiddlewareAlt, mediaController.getAllAdmin)
router.get('/public', mediaController.getAllPublic)
router.get('/:id', authMiddlewareAlt, mediaController.getById)
router.put('/:id', authMiddlewareAlt, uploadMedia.single('file'), mediaController.update)
router.delete('/:id', authMiddlewareAlt, mediaController.delete)
router.get('/rating'),authMiddlewareAlt, mediaController.getRatingById)
router.post('/rating',authMiddlewareAlt, mediaController.setRating)

export default router

