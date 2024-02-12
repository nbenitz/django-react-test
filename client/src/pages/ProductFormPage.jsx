import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { createProduct, uploadImages, deleteProduct, updateProduct, getProduct } from '../api/product.api'
import { getAllCategories } from '../api/product.api'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../config.js';
//yup
//zod


export function ProductFormPage() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const [categories, setCategories] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await getAllCategories();
        setCategories(res.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    }

    async function loadProduct() {
      try {
        if (params.id) {
          const { data } = await getProduct(params.id);
          console.log(data);
          setValue('nombre', data.nombre);
          setValue('estado', data.estado);
          setValue('categoria', data.categoria);
          // Establecer las imágenes asociadas al producto en el estado local
          setProductImages(data.imagenes);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      }
    }

    loadCategories();
    loadProduct(params.id);
  }, []);

  const onSubmit = handleSubmit(async data => {
    const productData = {
      nombre: data.nombre,
      estado: data.estado,
      categoria: data.categoria
    };

    if (params.id) {
      console.log('Actualizando');
      const res = await updateProduct(params.id, productData);

    } else {
      console.log('Creando');
      const res = await createProduct(productData);
      const productId = res.data.id;

      // Subir las imágenes asociadas al producto
      for (let i = 0; i < data.imagenes.length; i++) {
        const imageFormData = new FormData();
        imageFormData.append('producto', productId);
        imageFormData.append('imagen', data.imagenes[i]);

        // Subir la imagen actual
        await uploadImages(imageFormData);
      }

    }
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
        <div>
          <input type="file" {...register('imagenes', { required: true })} multiple />
          {errors.imagenes && <p><span>Por favor selecciona al menos una imagen</span></p>}
        </div>
        {/* Mostrar miniaturas de las imágenes seleccionadas */}
        <div>
          {productImages && productImages.map((image, index) => (
            image && <img key={index} src={API_URL + image} alt={`Imagen ${index}`} style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }} />
          ))}
        </div>

        <button>Guardar</button>
      </form>

      {/* Botón Eliminar si se está editando */}
      {params.id && (
        <button
          onClick={async () => {
            const accepted = window.confirm('Está seguro que desea Eliminar este archivo?');
            if (accepted) {
              await deleteProduct(params.id);
              navigate('/products');
            }
          }}
        >
          Eliminar
        </button>)}
    </div>
  )
}  