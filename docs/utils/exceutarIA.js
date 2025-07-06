const URL_API = "https://sync.kognitiva.app";

async function executarIA(tokenSessao, mensagem, contexto_valido = {}) {
  try {
    const resposta = await fetch(`${URL_API}/executar`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenSessao}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        mensagem_usuario: mensagem,
        contexto: contexto_valido,
        modo_execucao: "execucao",
        framework_version: "3.4-finalUX"
      })
    });

    if (!resposta.ok) {
      throw new Error(`Erro na execução: ${resposta.status}`);
    }

    const resultado = await resposta.json();

    return {
      resposta: resultado.resposta,
      modelo: resultado.modelo_utilizado || "desconhecido",
      score: resultado.score_resposta || null,
      fallback: resultado.fallback || false
    };
  } catch (erro) {
    console.error("Erro ao executar IA:", erro);
    return {
      resposta: "⚠ Ocorreu um erro na execução da IA.",
      modelo: "fallback",
      score: 0,
      fallback: true
    };
  }
}

export { executarIA };
