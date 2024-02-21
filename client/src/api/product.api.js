import axios from 'axios'

const productApi = axios.create({
  baseURL: 'http://localhost:8000/products/api/v1/',
})

const authApi = axios.create({
  baseURL: 'http://localhost:8000/api/token/',
})

export const getAllProducts = () => productApi.get('productos/');

export const getProduct = (id) => productApi.get(`productos/${id}/`);

export const getAllCategories = () => productApi.get('categorias/');

export const createProduct = (product) => productApi.post('productos/', product);

export const uploadImages = (imageFormData) => productApi.post('imagenes/', imageFormData, {headers: {'Content-Type': 'multipart/form-data'}});

export const deleteProduct = (id) => productApi.delete(`productos/${id}/`);

export const updateProduct = (id, product) => productApi.put(`productos/${id}/`, product);

export const deleteImage = (id) => productApi.delete(`imagenes/${id}/`);

// gestionar la solicitud de inicio de sesión
export const login = (username, password) => authApi.post('', { username, password });