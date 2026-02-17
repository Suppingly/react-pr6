import { useEffect, useState } from 'react'
import { fetchPublicMedia } from '../../api/media'
import type { MediaExtend } from '../../types/Media'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../authPage/context/AuthContext'
import type { DeleteMedia } from '../../types/Media'
import './MediaPage.css'

const DeleteMedia: React.FC<DeleteMedia> = ({ id, onSave, onClose }) => {
  useEffect(() => {
    //Запрос на получение текущей оценки пользователя на запись
  }
  const [rating,setRating] = useState(rate?rate:'')
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData()
    formData.append('mediaId',id)
    formData.append('rating',rating)
    await setRating(formData)
    setRating
    onSave()
    onClose()
  }
  return (
    <div className='media-update-bg'>
      <div className='media-update-con'>
        <h2 className='media-update-title'>Оценка записи</h2>
        <form className='media-update-form' onSubmit={handleSubmit}>
          <select
            value={rating}
            className='form-select'
            onChange={(e) => setRating(e.target.value)}
            required
          >
            <option value=''>Введите оценку</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            ))}
          </select><p/>
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

const PublicMediaPage = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  useEffect(() => {
    if (user == null) navigate('/')
  }, [user, navigate])
  const [mediaItems, setMediaItems] = useState<MediaExtend[]>([])
  const [filterCategory, setFilterCategory] = useState('')
  const [filterType, setFilterType] = useState('')

  useEffect(() => {
    reload()
  }, [])

  const reload = async () => {
    const items = await fetchPublicMedia({
      category: filterCategory || undefined,
      type: filterType || undefined,
    })
    setMediaItems(items)
  }
  const [isUpdateOpen, setIsUpdateOpen] = useState<boolean>(false)
  const [updateData, setUpdateData] = useState<Number>(0)
  const openUpdate = (media:Media) => {
    setUpdateData(media)
    setIsUpdateOpen(true)
  }
  const closeUpdate = () => {
    setIsUpdateOpen(false)
  }

  return (
    <div className='media-page'>
      <div className='media-title'>
        <h1 className='page-title'>Публичная медиатека</h1>
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
                <Link to='/library'>
                  <button className='button-login'>Мои медиа</button>
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

      <h2 className='section-title'>Все медиафайлы</h2>
      <div className='media-list'>
        {mediaItems.map((item) => (
          <div key={item.id} className='media-card'>
            <h3 className='media-title'>{item.title}</h3>
            <h4 className='media-category'>Категория: {item.category}</h4>
            <h4 className='media-category'>{item.type === 'movie' ? 'Фильм' : 'Альбом'}</h4>
            <h4 className='media-rating'>Рейтинг: {item.ratingAvgScore}</h4>
            <h4 className='media-rating-count'>Количество голосов: {item.count}</h4>
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
            <button className='form-button' onClick=>Оценить</button>
          </div>
        ))}
      </div>
    </div>
    {isRatingOpen && (
        <SetRating
          id={updateData}
          onSave={reload}
          onClose={closeUpdate}
        />
    )}
  )
}

export default PublicMediaPage
