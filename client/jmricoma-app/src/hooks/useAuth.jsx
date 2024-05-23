const useAuth = () => {
    const token = localStorage.getItem('token');
    return !!token; // Convierte la presencia del token en un booleano
};

export default useAuth;