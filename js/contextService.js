const redis = require('ioredis');
const client = new redis(process.env.REDIS_URL);

function salvarContexto(contexto) {
    client.set('contexto:usuario', JSON.stringify(contexto), 'EX', process.env.CACHE_TTL);
}

function obterContexto() {
    return client.get('contexto:usuario').then(result => JSON.parse(result));
}
