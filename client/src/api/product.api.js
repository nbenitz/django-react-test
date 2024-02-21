import axios from 'axios'

const productApi = axios.create({
  baseURL: 'http://localhost:8000/products/api/v1/',
})

const authApi = axios.create({
  baseURL: 'http://localhost:8000/api/token/',
})

// Intercepta las solicitudes salientes y agrega el token JWT al encabezado de autorización
productApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('token');
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepta las solicitudes salientes y agrega el token JWT al encabezado de autorización
authApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const getAllProducts = () => productApi.get('productos/');

export const getProduct = (id) => productApi.get(`productos/${id}/`);

export const getAllCategories = () => productApi.get('categorias/');

export const createProduct = (product) => productApi.post('productos/', product);

export const uploadImages = (imageFormData) => productApi.post('imagenes/', imageFormData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const deleteProduct = (id) => productApi.delete(`productos/${id}/`);

export const updateProduct = (id, product) => productApi.put(`productos/${id}/`, product);

export const deleteImage = (id) => productApi.delete(`imagenes/${id}/`);

export const getUserApprovalStatus = () => productApi.get(`user/approved/`);

// gestionar la solicitud de inicio de sesión
export const login = (username, password) => authApi.post('', { username, password });