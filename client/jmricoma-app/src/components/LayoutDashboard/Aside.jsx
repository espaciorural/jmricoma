import React from 'react';
import literals from '../../literals/es';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from './../DashboardContext'; // Importa el hook de contexto

function Aside() {
    const { dashboard } = literals;
    const navigate = useNavigate();
    const { navigate: changePage, currentPage } = useDashboard(); // Utiliza un nombre diferente para evitar conflictos

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin'); // Mantiene la funcionalidad de logout
    };

    const isActive = (menuItem) => menuItem === currentPage ? 'bg-blue-700' : '';

    // Modifica los onClick de los li para cambiar el contenido de MainContent usando el contexto
    return (
      <aside className="fixed h-screen w-64 bg-gray-800 text-white">
        <nav>
          <h1 className="text-xl font-semibold p-4 border-b border-gray-700">Admin Dashboard</h1>
          <ul>
            <li className={`p-4 hover:bg-gray-700 cursor-pointer ${isActive('Home')}`} onClick={() => changePage('Home')}>{dashboard.homeLabel}</li>
            <li className={`p-4 hover:bg-gray-700 cursor-pointer ${isActive('Services')}`} onClick={() => changePage('Services')}>{dashboard.servicesLabel}</li>
            <li className="p-4 hover:bg-gray-700 cursor-pointer" onClick={handleLogout}>{dashboard.exitLabel}</li>
          </ul>
        </nav>
      </aside>
    );
}

export default Aside;
