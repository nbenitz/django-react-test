import { API_URL } from '../config.js';
import { useNavigate } from 'react-router-dom'

export function ProductCard({ product }) {
  const navigate = useNavigate();
  let firstImage = null;

  if (product.imagenes.length > 0) {
    firstImage = API_URL + product.imagenes[0];
  }

  return (
    <div style={{background:'#303030'}}
      onClick={() => {
        navigate(`/products/${product.id}`);
      }}
    >
      <h1>{product.nombre}</h1>
      <p><b>Estado: </b>{product.estado}</p>
      <p><b>Categoría: </b>{product.categoria_nombre}</p>
      {firstImage && <img src={firstImage} alt={product.nombre} height="300" />}

    </div>
  )
}  