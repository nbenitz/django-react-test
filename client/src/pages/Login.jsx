import React, { useState } from 'react';
import { login } from '../api/product.api'
import { toast } from 'react-hot-toast'

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await login(username, password);
      const token = response.data.access;
      // Almacena el token en el localStorage o en las cookies
      localStorage.setItem('token', token);
      window.location.href = '/';
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      toast.error(`Error al iniciar sesión: ${error}`);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <h2 className="text-center text-3xl font-semibold mb-8">Iniciar sesión</h2>
      <div>
        <input
          type="text"
          className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <input
          type="password"
          className="bg-zinc-700 p-3 rounded-lg block w-full mb-3"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        className="bg-indigo-500 p-3 rounded-lg block w-full mt-3"
        onClick={handleLogin}
      >Iniciar sesión
      </button>
    </div>
  );
}
