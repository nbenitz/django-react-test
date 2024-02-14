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
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    loadInitialData();
  }, [params.id]);

  const loadInitialData = async () => {
    try {
      const categoriesData = await getAllCategories();
      setCategories(categoriesData.data);
      if (params.id) {
        const productData = await getProduct(params.id);
        setProductFields(productData.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Hubo un error al cargar los datos iniciales. Por favor, inténtalo de nuevo más tarde.');
    }
  };

  const setProductFields = (data) => {
    setValue('nombre', data.nombre);
    setValue('estado', data.estado);
    setValue('categoria', data.categoria);
    setProductImages(data.imagenes);
  };

  const onSubmit = handleSubmit(async data => {
    try {
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
      await handleImageUpload(productId, data.imagenes);
      await handleImageDeletion(data.imagenes_eliminar);
      handleSuccessMessage(params.id);
      navigate('/products');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Hubo un error al enviar el formulario. Por favor, inténtalo de nuevo más tarde.');
    }
  });

  const handleImageUpload = async (productId, images) => {
    if (images && images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const imageFormData = new FormData();
        imageFormData.append('producto', productId);
        imageFormData.append('imagen', images[i]);
        await uploadImages(imageFormData);
      }
    }
  };

  const handleImageDeletion = async (imagesToDelete) => {
    if (imagesToDelete && imagesToDelete.length > 0) {
      for (let i = 0; i < imagesToDelete.length; i++) {
        if (imagesToDelete[i]) {
          await deleteImage(imagesToDelete[i]);
        }
      }
    }
  };

  const handleSuccessMessage = (productId) => {
    const successMessage = params.id ? 'Producto actualizado correctamente' : 'Producto creado correctamente';
    toast.success(successMessage, {
      position: "botton-right",
      style: {
        background: "#101010",
        color: "#fff",
      }
    });
  };

  // Función para manejar la selección de archivos
  const handleFileChange = (event) => {
    try {
      const files = event.target.files;
      const previews = [];

      if (files.length > 0) {
        // Crear una lista de archivos seleccionados
        const fileList = Array.from(files);

        // Actualizar el estado de los archivos seleccionados
        setSelectedFiles(fileList);

        // Crear las vistas previas de los archivos
        fileList.forEach((file) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            previews.push(e.target.result);
            setFilePreviews(previews);
          };
          reader.readAsDataURL(file);
        });
      } else {
        // Limpiar el estado si no hay archivos seleccionados
        setSelectedFiles([]);
        setFilePreviews([]);
      }
    } catch (error) {
      console.error('Error handling file change:', error);
      toast.error('Hubo un error al manejar la selección de archivos. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={onSubmit}>
        <div className="mb-3">
          <input
            type="text"
            placeholder="Nombre"
            {...register('nombre', { required: true })}
            className="bg-zinc-700 p-3 rounded-lg block w-full"
          />
          {errors.nombre && <div className="w-full text-red-500">Este campo es requerido</div>}
        </div>

        <input
          type="text"
          placeholder="Estado"
          {...register('estado')}
          className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
        />

        {/* Selector de categoría */}
        <div className="mb-3">
          <select
            {...register('categoria', { required: true })}
            className="bg-zinc-700 p-3 rounded-lg block w-full"
          >
            <option value="">Selecciona una Categoría</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>{category.nombre}</option>
            ))}
          </select>
          {errors.categoria && <div className="w-full text-red-500">Por favor selecciona una categoría</div>}
        </div>

        {/* Mostrar miniaturas de las imágenes seleccionadas y las imágenes del producto */}
        <div className="flex flex-wrap bg-zinc-700 p-3 mb-3 rounded-lg">
          {productImages && productImages.map((image, index) => (
            <div key={index} className="mx-1 my-2">
              <img src={API_URL + image.url} alt={`Imagen ${index}`} className="max-h-32" />
              {/* Checkbox para eliminar la imagen */}
              <label className="flex items-center">
                <input type="checkbox" {...register(`imagenes_eliminar.${index}`)} value={image.id} className="mr-2" />
                <span className="text-white">Eliminar</span>
              </label>
            </div>
          ))}
        </div>

        {/* Campos para cargar imágenes */}
        <div className="bg-zinc-700 p-3 rounded-lg">
          <div>
            <label htmlFor="fileInput" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 mt-1 rounded inline-flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              Subir Imágenes
            </label>
            <span id="fileName" className="ml-3">
              {selectedFiles.length > 0 ?
                (selectedFiles.length === 1 ? selectedFiles[0].name : `${selectedFiles.length} imágenes`)
                : 'Sin archivos seleccionados'}
            </span>
            <input
              id="fileInput"
              type="file"
              className="absolute opacity-0 w-0 h-0"
              {...register('imagenes', { required: false })}
              accept="image/*"
              onChange={handleFileChange}
              multiple
            />
          </div>
          {/* Mostrar miniaturas de las imágenes seleccionadas */}
          <div className="flex flex-wrap mb-1">
            {filePreviews.map((preview, index) => (
              <img key={index} src={preview} alt={`Preview ${index}`} className="max-h-24 mt-3 mr-3" />
            ))}
          </div>
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