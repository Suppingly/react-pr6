import React from 'react'
import { Route, Routes } from 'react-router-dom'
import MediaPage from '../pages/headersPage/MediaPage'
import AuthForm from '../pages/authPage/components/AuthForm'
import AdminPage from '../pages/headersPage/AdminPage'
import PublicMediaPage from '../pages/headersPage/PublicMediaPage'

const AppRoutes: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path='/' element={<AuthForm />} />
        <Route path='/library' element={<MediaPage />} />
        <Route path='/admin' element={<AdminPage />} />
        <Route path='/public' element={<PublicMediaPage />} />
      </Routes>
    </>
  )
}

export default AppRoutes