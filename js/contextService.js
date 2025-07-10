function salvarContextoNoLocalStorage(contexto) {
    localStorage.setItem('contexto_conversa', JSON.stringify(contexto));
}
function recuperarContextoDoLocalStorage() {
    const contexto = localStorage.getItem('contexto_conversa');
    return contexto ? JSON.parse(contexto) : null;
}
