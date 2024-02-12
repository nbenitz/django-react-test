import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProductPage } from './pages/ProductPage'
import { ProductFormPage } from './pages/ProductFormPage'
import { Navigation } from './components/Navigation'


function App() {

  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path='/' element={<Navigate to='/products' />} />
        <Route path='/products' element={<ProductPage />} />
        <Route path='/products-create' element={<ProductFormPage />} />
        <Route path='/products/:id/' element={<ProductFormPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
