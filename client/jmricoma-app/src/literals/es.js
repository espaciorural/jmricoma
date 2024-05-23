const literals = {
    login: {
      usernameLabel: "Nombre de usuario",
      usernamePlaceholder: "Tu nombre de usuario",
      passwordLabel: "Contraseña",
      loginButton: "Iniciar Sesión",
      successMessage: "Inicio de sesión exitoso",
      failureMessage: "Credenciales inválidas",
      errorMessage: "Error de inicio de sesión",
    },
    dashboard: {
      homeLabel: "Inicio",
      servicesLabel: "Servicios",
      exitLabel: "Salir",
      titles: {
        "/dashboard": "Inicio",
      }
    },
  };
  export const getTitleByPath = (currentPage) => {
    const titles = {
      Home: "Inicio",
      Services: "Servicios",
    };
  
    return titles[currentPage] || "Inicio";
  };

  export default literals;
  