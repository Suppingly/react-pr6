import multer from 'multer'
import path from 'path'

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'src/uploads/media')
  },
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname)
    cb(null, `${Date.now()}${ext}`)
  },
})

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    'video/mp4',
    'video/webm',
    'video/ogg',
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/webm',
  ]
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Неподдерживаемый тип файла. Разрешены только видео и аудио файлы.'), false)
  }
}

export const uploadMedia = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
})