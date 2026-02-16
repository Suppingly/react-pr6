import { useEffect, useState } from 'react'
import {
  fetchMedia,
  createMedia,
  updateMedia,
  deleteMedia,
  getUsers,
} from '../../api/media'
import type { Media, UpdateMedia, DeleteMedia, Authors } from '../../types/Media'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../authPage/context/AuthContext'
import './MediaPage.css'

const UpdateMedia: React.FC<UpdateMedia> = ({ media, authors, onSave, onClose }) => {
  const [title, setTitle] = useState(media.title)
  const [desc, setDesc] = useState(media.desc)
  const [category, setCategory] = useState(media.category)
  const [type, setType] = useState(media.type)
  const [author, setAuthor] = useState(media.author)
  const [file, setFile] = useState<File | null>(null)

  const handleSubmitUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('desc', desc)
    formData.append('category', category)
    formData.append('type', type)
    formData.append('author', author)
    if (file) {
      formData.append('file', file)
    }
    const res = await updateMedia(media.id, formData)
    
    setTitle('')
    setDesc('')
    setCategory('')
    setType('')
    setAuthor('')
    setFile(null)
    onSave()
    onClose()
  }

  return (
    <div className='media-update-bg'>
      <div className='media-update-con'>
        <h2 className='media-update-title'>Изменение записи «{media.title}»</h2>
        <form className='media-update-form' onSubmit={handleSubmitUpdate}>
          <input
            className='form-input-title'
            type='text'
            placeholder='Название'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <p />
          <input
            className='form-input-desc'
            type='text'
            placeholder='Описание'
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            required
          />
          <p />
          <input
            className='form-input-category'
            type='text'
            placeholder='Жанр / категория'
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          />
          <p />
          <select
            value={author}
            className='form-select'
            onChange={(e) => setAuthor(e.target.value)}
            required
          >
            <option value=''>Автор записи</option>
            {authors.map((author) => (
              <option key={author.id} value={author.name}>
                {author.name}
              </option>
            ))}
          </select>
          <p />
          <label className='form-input'>
            {file ? file.name : media.filePath ? 'Файл загружен' : 'Выбрать видео/аудио файл'}
            <input
              className='form-input-d'
              type='file'
              accept='video/*,audio/*'
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </label>
          <p />
          <div className='media-update-buttons'>
            <button className='media-update-submit' type='submit'>
              Сохранить
            </button>
            <button onClick={onClose} className='media-update-close' type='button'>
              Закрыть
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const DeleteMedia: React.FC<DeleteMedia> = ({ id, onSave, onClose }) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await deleteMedia(id)
    onSave()
    onClose()
  }
  return (
    <div className='media-delete-bg'>
      <div className='media-delete-con'>
        <h2 className='media-delete-title'>Вы точно хотите удалить запись?</h2>
        <form className='media-delete-form' onSubmit={handleSubmit}>
          <button className='media-button-red' type='submit'>
            Удалить
          </button>
          <button onClick={onClose} className='media-button-green' type='button'>
            Нет
          </button>
        </form>
        <p />
      </div>
    </div>
  )
}

const MediaPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (user == null) navigate('/')
  }, [user, navigate])

  const [mediaItems, setMediaItems] = useState<Media[]>([])
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [category, setCategory] = useState('')
  const [author, setAuthor] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [authors, setAuthors] = useState<Authors[]>([])

  const [filterCategory, setFilterCategory] = useState('')
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    fetchMedia().then(setMediaItems)
    getUsers().then(setAuthors)
  }, [])

  const reloadWithFilters = async () => {
    const items = await fetchMedia({
      category: filterCategory || undefined,
      type: filterType || undefined,
    })
    setMediaItems(items)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('title', title)
    formData.append('desc', desc)
    formData.append('category', category)
    formData.append('author', author)
    if (file) {
      const type=file.type
      if (type.includes('video'))
        formData.append('type', 'movie')
      else
        formData.append('type', 'album')
      formData.append('file', file)
    }
    const newMedia = await createMedia(formData)
    setMediaItems([newMedia, ...mediaItems])
    setTitle('')
    setDesc('')
    setCategory('')
    setAuthor('')
    setFile(null)
  }
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false)
  const [updateData, setUpdateData] = useState<Media>({
    id: 0,
    title: '',
    desc: '',
    category: '',
    type:'',
    author: '',
  })
  const openUpdate = (media:Media) => {
    setUpdateData(media)
    setIsUpdateOpen(true)
  }
  const handleSave = () => {
    fetchMedia().then(setMediaItems)
  }
  const closeUpdate = () => {
    setIsUpdateOpen(false)
  }

  const [deleteData, setDeleteData] = useState<Number>(0)
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const openDelete = (id:Number) => {
    setDeleteData(id)
    setIsDeleteOpen(true)
  }
  const closeDelete = () => {
    setIsDeleteOpen(false)
  }
  return (
    <div className='media-page'>
      <div className='media-title'>
        <h1 className='page-title'>Моя медиатека</h1>
        <div className='auth'>
          {user && <span className='user-name'>{user.name}</span>}
          <div className='media-action'>
            {!user ? (
              <>
                <Link to='/'>
                  <button className='button-login'>Войти</button>
                </Link>
              </>
            ) : (
              <>
                <Link to='/public'>
                  <button className='button-login'>Все медиа</button>
                </Link>
                {user.role === 'ADMIN' && (
                  <Link to='/admin'>
                    <button className='button-login'>Админ-панель</button>
                  </Link>
                )}
                <button onClick={logout} className='button-logout'>
                  Выйти
                </button>
              </>
            )}
          </div>
        </div>
      </div>
      <form className='media-form' onSubmit={handleSubmit}>
        <div className='form-title'>Добавление новой записи</div>
        <input
          className='form-input-title'
          type='text'
          placeholder='Название фильма или альбома'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <p />
        <input
          className='form-input-desc'
          type='text'
          placeholder='Описание'
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <p />
        <input
          className='form-input-category'
          type='text'
          placeholder='Жанр / категория'
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <p />
        <select
          className='form-select'
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        >
          <option value=''>Автор записи</option>
          {authors.map((author) => (
            <option key={author.id} value={author.name}>
              {author.name}
            </option>
          ))}
        </select>
        <p />
        <label className='form-input'>
          {file ? file.name : 'Выбрать видео/аудио файл'}
          <input
            className='form-input-d'
            type='file'
            accept='video/*,audio/*'
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
        </label>
        <p />
        <button className='form-button' type='submit'>
          Добавить
        </button>
      </form>
      <div className='error'></div>
      <p />

      <div className='filters'>
        <input
          className='form-input-category'
          type='text'
          placeholder='Фильтр по жанру'
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        />
        <select
          className='form-select'
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value=''>Все типы</option>
          <option value='movie'>Фильмы</option>
          <option value='album'>Альбомы</option>
        </select>
        <button className='form-button' type='button' onClick={reloadWithFilters}>
          Применить фильтры
        </button>
      </div>

      <h2 className='section-title'>Мои записи</h2>
      <div className='media-list'>
        {mediaItems.map((item) => (
          <div key={item.id} className='media-card'>
            <h3 className='media-title'>{item.title}</h3>
            <h4 className='media-category'>Категория: {item.category}</h4>
            <h4 className='media-category'>{item.type === 'movie' ? 'Фильм' : 'Альбом'}</h4>
            {item.filePath && (
              <div className='media-player'>
                {item.type === 'movie' ? (
                  <video controls className='media-video'>
                    <source src={`http://localhost:4200${item.filePath}`} />
                    Ваш браузер не поддерживает видео.
                  </video>
                ) : (
                  <audio controls className='media-audio'>
                    <source src={`http://localhost:4200${item.filePath}`} />
                    Ваш браузер не поддерживает аудио.
                  </audio>
                )}
              </div>
            )}
            <h4 className='media-author'>От: {item.author}</h4>
            <h4 className='media-desc'>{item.desc}</h4>
            <div className='media-buttons'>
              <button
                className='media-button-green'
                onClick={() => {
                  openUpdate(item)
                }}
                type='button'
              >
                Изменить
              </button>
              <button
                className='media-button-red'
                onClick={() => {
                  openDelete(item.id)
                }}
                type='button'
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
      {isUpdateOpen && (
        <UpdateMedia
          media={updateData}
          authors={authors}
          onSave={handleSave}
          onClose={closeUpdate}
        />
      )}
      {isDeleteOpen && (
        <DeleteMedia
          id={deleteData}
          onSave={handleSave}
          onClose={closeDelete}
        />
      )}
    </div>
  );
}
export default MediaPage