import { API_URL } from '../config.js';
import { useNavigate } from 'react-router-dom'

export function ProductCard({ product }) {
  const navigate = useNavigate();
  let firstImage = null;
  const isAuthenticated = localStorage.getItem('token');

  if (product.imagenes.length > 0) {
    firstImage = API_URL + product.imagenes[0].url;
  }

  return (
    <div
      className='bg-zinc-800 p-3 hover:bg-zinc-700 hover:cursor-pointer'
      onClick={() => { navigate(`/products/${product.id}`); }}
    >
      <h1 className='font-bold uppercase'>{product.nombre}</h1>
      {firstImage && isAuthenticated && (
        <img src={firstImage} alt={product.nombre} className="max-h-300 my-2" />
      )}
      <p className='text-slate-400'><b>Estado: </b>{product.estado}</p>
      {isAuthenticated && <p className='text-slate-400'><b>Categoría: </b>{product.categoria_nombre}</p>}

    </div>
  )
}  