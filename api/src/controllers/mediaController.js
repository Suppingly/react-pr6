import mediaService from '../services/mediaService.js'
import { existsSync, unlink } from 'fs'

class MediaController {
  async create(req, res, next) {
    try {
      const { title, desc, category, type, author } = req.body
      const userId = req.user.id
      const filePath = req.file ? `/uploads/media/${req.file.filename}` : null
      const media = await mediaService.create({
        title,
        desc,
        category,
        type,
        userId,
        author,
        filePath,
      })
      res.status(201).json({ data: media, error: null })
    } catch (err) {
      next(err)
    }
  }

  async getAllPublic(req, res, next) {
    try {
      const { category, type, search } = req.query

      const media = await mediaService.getAll({
        category,
        type,
        search,
      })
      res.json({ data: media, error: null })
    } catch (err) {
      next(err)
    }
  }

  async getAllAdmin(req, res, next) {
    try {
      if (req.user.role !== 'ADMIN') {
        const error = new Error('Нет прав')
        error.status = 403
        throw error
      }

      const { category, type, search } = req.query

      const media = await mediaService.getAll({
        category,
        type,
        search,
      })
      res.json({ data: media, error: null })
    } catch (err) {
      next(err)
    }
  }

  async getAllByUser(req, res, next) {
    try {
      const userId = req.user.id
      if (userId == null) {
        const error = new Error('Не авторизован')
        error.status = 401
        throw error
      }

      const { category, type, search } = req.query

      const media = await mediaService.getAllByUser(userId, {
        category,
        type,
        search,
      })
      res.json({ data: media, error: null })
    } catch (err) {
      next(err)
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params
      const item = await mediaService.getById(id)
      if (!item) {
        const error = new Error('Запись не найдена')
        error.status = 404
        throw error
      }
      if (req.user.role !== 'ADMIN' && item.userId !== req.user.id) {
        const error = new Error('Нет прав')
        error.status = 403
        throw error
      }
      res.json({ data: item, error: null })
    } catch (err) {
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params
      const existing = await mediaService.getById(id)
      if (!existing) {
        const error = new Error('Запись не найдена')
        error.status = 404
        throw error
      }
      if (req.user.role !== 'ADMIN' && existing.userId !== req.user.id) {
        const error = new Error('Нет прав')
        error.status = 403
        throw error
      }

      const { title, desc, category, type, author } = req.body
      let filePath = existing.filePath

      if (req.file) {
        if (existing.filePath && existsSync(`src${existing.filePath}`)) {
          unlink(`src${existing.filePath}`, (err) => {
            if (err) console.error('Ошибка удаления старого файла:', err)
          })
        }
        filePath = `/uploads/media/${req.file.filename}`
      }

      const updated = await mediaService.update({
        id,
        title,
        desc,
        category,
        type,
        author,
        filePath,
      })
      res.json({ data: updated, error: null })
    } catch (err) {
      next(err)
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params
      const existing = await mediaService.getById(id)
      if (!existing) {
        const error = new Error('Запись не найдена')
        error.status = 404
        throw error
      }
      if (req.user.role !== 'ADMIN' && existing.userId !== req.user.id) {
        const error = new Error('Нет прав')
        error.status = 403
        throw error
      }

      if (existing.filePath && existsSync(`src${existing.filePath}`)) {
        unlink(`src${existing.filePath}`, (err) => {
          if (err) console.error('Ошибка удаления файла:', err)
        })
      }

      const deleted = await mediaService.delete(id)
      res.json({ data: deleted, error: null })
    } catch (err) {
      next(err)
    }
  }
  async getRatingById(req,res,next) {
    try {
      const userId = req.user.id
      const { mediaId } = req.body
      const rate = await mediaService.getRating({mediaId,userId})
      res.json({ data: rate, error: null })
    } catch (err) {
      next(err)
    }
  }
  async setRating(req,res,next) {
    try {
      const userId = req.user.id
      const { ratingScore } = req.body
      const { mediaId } = req.params
      const rating = await mediaService.setRating({ratingScore,mediaId,userId})
      res.json({ data: rating, error: null })
    } catch (err) {
      next(err)
    }
  }
}


export default new MediaController()

