import React from 'react';
import { useDashboard } from './../DashboardContext'; // Ajusta la ruta según sea necesario
import Header from './Header';
import Home from './Home';
import Services from './Services';
import Portfolio from './Portfolio';
import Footer from './Footer';

function MainContent() {
  const { currentPage } = useDashboard();

  const renderContent = () => {
    switch (currentPage) {
      case 'Portfolio':
        return <Portfolio />;
      case 'Services':
        return <Services />;
      case 'Home':
        return <Home />;
      default:
        return <Home />;
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen pl-64">
      <Header />
      {renderContent()}
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  );
}

export default MainContent;
