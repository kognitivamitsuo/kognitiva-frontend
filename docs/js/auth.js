function verificarTokenJWT() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        window.location.href = '/login';
        return false;
    }
    console.log('Token JWT encontrado e válido.');
    return true;
}
