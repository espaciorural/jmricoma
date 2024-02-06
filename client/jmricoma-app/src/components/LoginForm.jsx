import React, { useState } from "react";
import axios from "axios";
import literals from '../literals/es'; 

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  // Añade un nuevo estado para almacenar mensajes para el usuario
  const [message, setMessage] = useState("");

  const { login } = literals; 

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage(""); // Limpia mensajes anteriores
    try {
      const response = await axios.post("http://jmricoma/auth/login", {
        username,
        password,
      });
    if (response.data.success) {
        window.location.href = "/";
      } else {
        setMessage(login.failureMessage);
      }
    } catch (error) {
      console.error(login.errorMessage, error);
      setMessage(login.errorMessage + error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="max-w-md mx-auto mt-10">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                {login.usernameLabel}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={login.usernamePlaceholder}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                {login.passwordLabel}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="******************"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              {login.loginButton}
            </button>
          </div>
          {/* Muestra el mensaje al usuario aquí */}
          {message && <div className="mt-4 text-center text-sm font-medium text-red-600">{message}</div>}
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
