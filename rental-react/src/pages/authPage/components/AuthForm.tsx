import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LoginForm from './LoginForm'
import RegisterForm from './RegisterForm'
import './AuthForm.css'

const AuthForm: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)

  const toggleForm = () => setIsLogin((prev) => !prev)

  return (
    <div className='auth-container'>
      <h1 className='auth-title'>{isLogin ? 'Авторизация' : 'Регистрация'}</h1>
      {isLogin ? <LoginForm /> : <RegisterForm />}
      <button onClick={toggleForm} className='toggle-button'>
        {isLogin ? 'Нет аккаунта? Регистрация' : 'Есть аккаунт? Войти'}
      </button>
      <Link to='/public'>
        <button className='toggle-button' style={{ marginTop: '10px' }}>
          Просмотреть все медиафайлы
        </button>
      </Link>
    </div>
  )
}

export default AuthForm;
