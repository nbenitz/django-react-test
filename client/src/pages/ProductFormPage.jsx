import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { createProduct, uploadImages, deleteProduct, updateProduct, getProduct, deleteImage } from '../api/product.api'
import { getAllCategories } from '../api/product.api'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../config.js';

export function ProductFormPage() {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
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

    async function loadProduct(productId) {
      try {
        if (productId) {
          const { data } = await getProduct(productId);
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
  }, [params.id]);

  const onSubmit = handleSubmit(async data => {
    const productData = {
      nombre: data.nombre,
      estado: data.estado,
      categoria: data.categoria
    };

    let productId;

    if (params.id) {
      console.log('Actualizando');
      await updateProduct(params.id, productData);
      productId = params.id;
    } else {
      console.log('Creando');
      const res = await createProduct(productData);
      productId = res.data.id;
    }

    // Subir las nuevas imágenes asociadas al producto
    if (data.imagenes && data.imagenes.length > 0) {
      for (let i = 0; i < data.imagenes.length; i++) {
        const imageFormData = new FormData();
        imageFormData.append('producto', productId);
        imageFormData.append('imagen', data.imagenes[i]);
        await uploadImages(imageFormData);
      }
    }

    console.log(data);
    // Eliminar las imágenes que se han marcado para eliminar
    if (data.imagenes_eliminar && data.imagenes_eliminar.length > 0) {
      for (let i = 0; i < data.imagenes_eliminar.length; i++) {
        if (data.imagenes_eliminar[i]) {
          await deleteImage(data.imagenes_eliminar[i]);
        }
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
          <input type="file" {...register('imagenes', { required: false })} multiple />
          {errors.imagenes && <p><span>Por favor selecciona al menos una imagen</span></p>}
        </div>
        {/* Mostrar miniaturas de las imágenes seleccionadas y las imágenes del producto */}
        <div>
          {productImages && productImages.map((image, index) => (
            <div key={index}>
              <img src={API_URL + image.url} alt={`Imagen ${index}`} style={{ maxWidth: '100px', maxHeight: '100px', margin: '5px' }} />
              {/* Checkbox para eliminar la imagen */}
              <label>
                <input type="checkbox" {...register(`imagenes_eliminar.${index}`)} value={image.id} />
                Eliminar
              </label>
            </div>
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