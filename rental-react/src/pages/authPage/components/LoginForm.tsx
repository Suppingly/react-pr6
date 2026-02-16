import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Хук для навигации между страницами
import { useAuth } from '../context/AuthContext'; // Хук для использования контекста аутентификации

const LoginForm: React.FC = () => {
  const { login, error } = useAuth(); // Получаем функции login и error из контекста аутентификации
  const navigate = useNavigate(); // Хук для перехода на другую страницу
  const [email, setEmail] = useState(''); // Стейт для хранения значения email
  const [password, setPassword] = useState(''); // Стейт для хранения значения пароля

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы (перезагрузку страницы)
    try {
      // Пытаемся выполнить вход с указанными данными
      await login(email, password);
      // После успешного логина перенаправляем на главную страницу
      navigate('/library');
    } catch (err) {
      // Ошибка уже обработана в useAuth, дополнительной обработки не требуется
    }
  };

  return (
    <form onSubmit={handleSubmit} className='auth-form'>
      {' '}
      {/* Обработчик события отправки формы */}
      {/* Поле для ввода email */}
      <input
        type='email'
        placeholder='E-mail'
        value={email} // Значение input — это email из состояния
        onChange={(e) => setEmail(e.target.value)} // Обновляем состояние при изменении значения в поле
        required // Делает поле обязательным для заполнения
      />
      {/* Поле для ввода пароля */}
      <input
        type='password'
        placeholder='Пароль'
        value={password} // Значение input — это пароль из состояния
        onChange={(e) => setPassword(e.target.value)} // Обновляем состояние при изменении значения в поле
        required // Делает поле обязательным для заполнения
      />
      {/* Если есть ошибка, показываем сообщение */}
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Сообщение об ошибке */}
      {/* Кнопка для отправки формы */}
      <button type='submit' className='submit-button'>
        Войти
      </button>
    </form>
  );
};

export default LoginForm;
