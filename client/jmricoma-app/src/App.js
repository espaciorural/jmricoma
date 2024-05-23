import React, { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import Home from './components/Home';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import Contact from './components/Contact';
import Footer from './components/Footer';


function App() {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleLanguageChange = useCallback((idLang) => {
    setSelectedLanguage(idLang);
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Rutas del administrador */}
          <Route path="/admin" element={<LoginForm />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>

          {/* Rutas públicas */}
          <Route
            path="/*"
            element={
              <>
                <Header onLanguageChange={handleLanguageChange} />
                <Routes>
                  <Route path="/" element={<Home idSection={1} idLang={selectedLanguage} />} />
                  <Route path="/:lang" element={<Home idSection={1} idLang={selectedLanguage} />} />
                  <Route path="/serveis" element={<Services idLang={selectedLanguage} />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="/contact" element={<Contact />} />
                </Routes>
                <Footer onLanguageChange={handleLanguageChange} />
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
