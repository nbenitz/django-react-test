import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { createProduct, deleteProduct } from '../api/product.api'
import { getAllCategories } from '../api/product.api'
import { useNavigate, useParams } from 'react-router-dom'
//yup
//zod


export function ProductFormPage() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  console.log(params);

  useEffect(() => {
    // Llamada a la API para obtener las categorías al cargar el componente
    async function loadCategories() {
      try {
        const res = await getAllCategories();
        setCategories(res.data);
        console.log(res);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    loadCategories();
  }, []);

  const onSubmit = handleSubmit(async data => {
    const formData = new FormData();
    formData.append('nombre', data.nombre);
    formData.append('estado', data.estado);
    formData.append('categoria', data.categoria);
    // Agregar imágenes al FormData
    for (let i = 0; i < data.imagenes.length; i++) {
      formData.append('imagenes', data.imagenes[i]); // Verifica que 'imagenes' sea el nombre correcto esperado por el backend
    }
    await createProduct(formData);
    navigate('/products');
  });

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input type="text" placeholder="Nombre" {...register('nombre', { required: true })} />
        {errors.nombre && <span>Este campo es requerido</span>}

        <input type="text" placeholder="Estado" {...register('estado')} />

        {/* Selector de categoría */}
        <select {...register('categoria', { required: true })}>
          <option value="">Selecciona una Categoría</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.nombre}</option>
          ))}
        </select>
        {errors.categoria && <span>Por favor selecciona una categoría</span>}
        
        {/* Campos para cargar imágenes */}
        <input type="file" {...register('imagenes', { required: true })} multiple />
        {errors.imagenes && <span>Por favor selecciona al menos una imagen</span>}

        <button>Guardar</button>
      </form>
      
      {/* Botón Eliminar si se está editando */}
      {params.id && <button onClick={() => {
        const accepted = window.confirm('Está seguro que desea Eliminar este archivo?');
        if (accepted) {
          deleteProduct(params.id);
          navigate('/products');
        }
      }}>Eliminar</button>}

      
    </div>
  )
}  