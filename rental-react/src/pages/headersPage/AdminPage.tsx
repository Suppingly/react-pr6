import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { fetchAllMedia, deleteMedia } from '../../api/media'
import type { Media,DeleteMedia } from '../../types/Media'
import { useAuth } from '../authPage/context/AuthContext'
import './MediaPage.css'

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

const AdminPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [media, setMedia] = useState<Media[]>([])
  const [filterCategory, setFilterCategory] = useState('')
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/')
      return
    }
    if (user.role !== 'ADMIN') {
      navigate('/library')
      return
    }
    reload()
  }, [user, navigate])

  const reload = async () => {
    const items = await fetchAllMedia({
      category: filterCategory || undefined,
      type: filterType || undefined,
    })
    setMedia(items)
  }

  const handleDelete = async (id: Number) => {
    await deleteMedia(id)
    reload()
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
        <h1 className='page-title'>Администрирование медиатеки</h1>
        <Link to='/library'>
                  <button className='button-login'>Мои медиа</button>
        </Link>
      </div>

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
        <button className='form-button' type='button' onClick={reload}>
          Применить фильтры
        </button>
      </div>

      <h2 className='section-title'>Все записи пользователей</h2>
      <div className='media-list'>
        {media.map((item) => (
          <div key={item.id} className='media-card'>
            <h3 className='media-title'>{item.title}</h3>
            <h4 className='media-category'>{item.category}</h4>
            <h4 className='media-category'>{item.type === 'movie' ? 'Фильм' : 'Альбом'}</h4>
            <h4 className='media-author'>{item.author}</h4>
            <h4 className='media-desc'>{item.desc}</h4>
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
            <div className='media-buttons'>
              <button
                className='media-button-red'
                type='button'
                onClick={() => openDelete(item.id)}
              >
                Удалить
              </button>
            </div>
          </div>
        ))}
      </div>
      {isDeleteOpen && (
        <DeleteMedia
          id={deleteData}
          onSave={reload}
          onClose={closeDelete}
        />
      )}
    </div>
  )
}

export default AdminPage

