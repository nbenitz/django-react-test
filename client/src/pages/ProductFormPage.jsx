import { useEffect, useState } from "react"
import { useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { createProduct, uploadImages, deleteProduct, updateProduct, getProduct, deleteImage } from '../api/product.api'
import { getAllCategories } from '../api/product.api'
import { useNavigate, useParams } from 'react-router-dom'
import { API_URL } from '../config.js';

export function ProductFormPage() {
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();
  const [categories, setCategories] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
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
      await updateProduct(params.id, productData);
      productId = params.id;
    } else {
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

    // Eliminar las imágenes que se han marcado para eliminar
    if (data.imagenes_eliminar && data.imagenes_eliminar.length > 0) {
      for (let i = 0; i < data.imagenes_eliminar.length; i++) {
        if (data.imagenes_eliminar[i]) {
          await deleteImage(data.imagenes_eliminar[i]);
        }
      }
    }

    if (params.id) {
      toast.success('Producto actualizado correctamente', {
        position: "botton-right",
        style: {
          background: "#101010",
          color: "#fff",
        }
      });
    } else {
      toast.success('Producto creado correctamente', {
        position: "botton-right",
        style: {
          background: "#101010",
          color: "#fff",
        }
      });
    }

    navigate('/products');
  });

  // Función para manejar la selección de archivos
  const handleFileChange = (event) => {
    const files = event.target.files;
    const previews = [];

    // Leer cada archivo seleccionado
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      // Configurar la función de devolución de llamada cuando se carga el archivo
      reader.onload = (e) => {
        previews.push(e.target.result); // Agregar la vista previa del archivo al array
        // Actualizar el estado de las vistas previas
        setFilePreviews(previews);
      };

      // Leer el archivo como una URL de datos
      reader.readAsDataURL(file);
    }
  };


  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={onSubmit}>

        <input
          type="text"
          placeholder="Nombre"
          {...register('nombre', { required: true })}
          className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
        />
        {errors.nombre && <span className="text-red-500">Este campo es requerido</span>}

        <input
          type="text"
          placeholder="Estado"
          {...register('estado')}
          className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
        />

        {/* Selector de categoría */}
        <select
          {...register('categoria', { required: true })}
          className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
        >
          <option value="">Selecciona una Categoría</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>{category.nombre}</option>
          ))}
        </select>
        {errors.categoria && <span className="text-red-500">Por favor selecciona una categoría</span>}

        {/* Campos para cargar imágenes */}
        <div className="mb-3">
          {/* Campo para cargar archivos con evento onChange */}
          <input type="file" {...register('imagenes', { required: false })} onChange={handleFileChange} multiple />
          {errors.imagenes && <p><span className="text-red-500">Por favor selecciona al menos una imagen</span></p>}
        </div>
        {/* Mostrar miniaturas de las imágenes seleccionadas */}
        <div className="flex flex-wrap">
          {filePreviews.map((preview, index) => (
            <img key={index} src={preview} alt={`Preview ${index}`} className="max-h-24 mb-2 mx-1" />
          ))}
        </div>
        {/* Mostrar miniaturas de las imágenes seleccionadas y las imágenes del producto */}
        <div className="flex flex-wrap">
          {productImages && productImages.map((image, index) => (
            <div key={index} className="m-2">
              <img src={API_URL + image.url} alt={`Imagen ${index}`} className="max-h-32 mb-2" />
              {/* Checkbox para eliminar la imagen */}
              <label className="flex items-center">
                <input type="checkbox" {...register(`imagenes_eliminar.${index}`)} value={image.id} className="mr-2" />
                <span className="text-white">Eliminar</span>
              </label>
            </div>
          ))}
        </div>

        <button
          className="bg-indigo-500 p-3 rounded-lg block w-full mt-3"
        >Guardar</button>
      </form>

      {/* Botón Eliminar si se está editando */}
      {params.id && (
        <div className="flex justify-end">
          <button
            className="bg-red-500 p-3 rounded-lg w-48 mt-3"
            onClick={async () => {
              const accepted = window.confirm('Está seguro que desea Eliminar este archivo?');
              if (accepted) {
                await deleteProduct(params.id);
                toast.success('Producto eliminado correctamente', {
                  position: "botton-right",
                  style: {
                    background: "#101010",
                    color: "#fff",
                  }
                });
                navigate('/products');
              }
            }}
          >
            Eliminar
          </button>
        </div>
      )}
      
    </div>
  )
}