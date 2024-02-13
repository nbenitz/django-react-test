import { Link } from 'react-router-dom'


export function Navigation() {
  return (
    <div className='flex justify-between py-3'>
      <Link to='products'>
        <h1 className='font-bold text-3xl mb-4'>Product App</h1>
      </Link>

      <button className='bg-indigo-500 px-3 py-2 rounded-lg'>
        <Link to='products-create'>Crear Producto</Link>
      </button>
    </div>

  )
}  