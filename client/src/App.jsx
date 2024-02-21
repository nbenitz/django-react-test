import React, { useEffect, useState } from "react"
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ProductPage } from './pages/ProductPage'
import { ProductFormPage } from './pages/ProductFormPage'
import { Login } from './pages/Login'
import { Navigation } from './components/Navigation'
import { Toaster } from 'react-hot-toast'
import { getUserApprovalStatus } from './api/product.api'


function App() {
  const [isApproved, setIsApproved] = useState(false);

  useEffect(() => {
    const getUserApproved = async () => {
      try {
        const response = await getUserApprovalStatus();
        setIsApproved(response.data.approved);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Hubo un error al cargar los datos iniciales. Por favor, inténtalo de nuevo más tarde.');
      }
    };

    getUserApproved();
  }, []);

  return (
    <BrowserRouter>
      <div className='container mx-auto'>
        <Navigation isApproved={isApproved} />
        <Routes>
          <Route path='/' element={<Navigate to='/products' />} />
          <Route path='/products' element={<ProductPage isApproved={isApproved} />} />
          <Route path='/products-create' element={<ProductFormPage />} />
          <Route path='/products/:id/' element={<ProductFormPage />} />
          <Route path='/login' element={<Login />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  )
}

export default App
