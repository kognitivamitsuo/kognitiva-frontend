const URL_API = "https://sync.kognitiva.app";

async function buscarCacheSuperprompt(cliente_nome, tokenSessao) {
  try {
    const resposta = await fetch(`${URL_API}/proxy/cache_superprompt?cliente_nome=${encodeURIComponent(cliente_nome)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${tokenSessao}`,
        'Content-Type': 'application/json'
      }
    });

    if (!resposta.ok) {
      console.warn(`⚠️ Cache não encontrado ou não autorizado: ${resposta.status}`);
      return null;
    }

    const resultado = await resposta.json();
    return resultado.superprompt || null;
  } catch (erro) {
    console.error('Erro ao buscar cache do superprompt:', erro);
    return null;
  }
}

async function executarIA(cliente_nome, mensagem, tokenSessao) {
  try {
    const resposta = await fetch(`${URL_API}/executar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenSessao}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        cliente_nome,
        mensagem
      })
    });

    if (!resposta.ok) {
      throw new Error(`Erro ao executar IA: ${resposta.status}`);
    }

    const resultado = await resposta.json();
    return resultado;
  } catch (erro) {
    console.error('Erro na execução da IA:', erro);
    return { resposta: '⚠️ Ocorreu um erro ao executar a IA.', status: 'erro' };
  }
}

export { buscarCacheSuperprompt, executarIA };


