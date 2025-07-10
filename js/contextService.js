const redis = require('ioredis');
const client = new redis(process.env.REDIS_URL);

// Salva o contexto no Redis com TTL
function salvarContexto(contexto) {
    client.set('contexto:usuario', JSON.stringify(contexto), 'EX', process.env.CACHE_TTL);
    console.log('🧠 Contexto salvo no Redis.');
}

// Recupera o contexto do Redis
function obterContexto() {
    return client.get('contexto:usuario').then(result => {
        if (result) {
            console.log('✅ Contexto recuperado do Redis.');
            return JSON.parse(result);
        }
        return null;
    });
}

// Salva contexto no navegador (localStorage)
function salvarContextoNoLocalStorage(contexto) {
    localStorage.setItem('contexto_conversa', JSON.stringify(contexto));
    console.log('🧠 Contexto armazenado no localStorage.');
}

// Recupera contexto do navegador (localStorage)
function recuperarContextoDoLocalStorage() {
    const contexto = localStorage.getItem('contexto_conversa');
    if (contexto) {
        console.log('✅ Contexto recuperado do localStorage.');
        return JSON.parse(contexto);
    }
    return null;
}

module.exports = {
    salvarContexto,
    obterContexto,
    salvarContextoNoLocalStorage,
    recuperarContextoDoLocalStorage
};
