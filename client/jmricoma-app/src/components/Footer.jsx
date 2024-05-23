import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full bg-black text-white py-4 text-center">
      jmricoma.com - {currentYear}
    </footer>
  );
};

export default Footer;
