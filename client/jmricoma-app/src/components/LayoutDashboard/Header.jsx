import React from 'react';
import { useDashboard } from './../DashboardContext';
import { getTitleByPath } from '../../literals/es';

function Header() {
  // Obtener la fecha actual y formatearla
  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const { currentPage } = useDashboard(); // Utiliza el estado currentPage del contexto
  const title = getTitleByPath(currentPage);

  return (
    <header className="flex justify-between items-center bg-blue-500 text-white p-4">
      <div>
        <span>{(title)}</span>
      </div>
      
      <div>
        {currentDate}
      </div>
    </header>
  );
}

export default Header;
