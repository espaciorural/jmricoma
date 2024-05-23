// DashboardContext.js
import React, { createContext, useContext, useState } from 'react';

const DashboardContext = createContext();

export const useDashboard = () => useContext(DashboardContext);

export const DashboardProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('Home');

  const navigate = (page) => {
    setCurrentPage(page);
  };

  return (
    <DashboardContext.Provider value={{ currentPage, navigate }}>
      {children}
    </DashboardContext.Provider>
  );
};
