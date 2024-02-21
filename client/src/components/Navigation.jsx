import React from "react"
import { Link, useNavigate } from 'react-router-dom';


export function Navigation({ isApproved }) {
  const isAuthenticated = localStorage.getItem('token');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className='flex justify-between py-3'>
      <div className='ml-4'>
        <Link to='products' className='font-bold text-3xl mb-4 mr-4'>
          Productos
        </Link>

        {isApproved && (
        <button className='bg-indigo-500 px-3 py-2 rounded-lg'>
          <Link to='products-create'>Crear Producto</Link>
        </button>
        )}
      </div>

      <div className='mr-4'>
        { isAuthenticated ? (
          <>
            <button className='bg-indigo-500 px-3 py-2 rounded-lg' onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <Link to='/login' className='mr-4'>Iniciar sesión</Link>
            <Link to='/register' className='mr-4'>Registrarse</Link>
          </>
        )}
      </div>
    </div>
  );
}
