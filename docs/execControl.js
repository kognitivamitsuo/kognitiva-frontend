
// execControl.js – responsável por execução cognitiva com fallback e rastreabilidade

async function executarIA(payload, tokenSessao) {
  try {
    const resposta = await fetch("https://sync.kognitiva.app/executar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenSessao}`
      },
      body: JSON.stringify(payload)
    });

    const dados = await resposta.json();
    return {
      resposta: dados.resposta,
      modelo_utilizado: dados.modelo_utilizado,
      superprompt: dados.superprompt,
      score_resposta: dados.score_resposta,
      fallback_ativado: dados.fallback_ativado || false
    };
  } catch (erro) {
    console.error("Erro na execução da IA:", erro);
    return {
      resposta: "⚠ Erro na IA. Modo alternativo ativado.",
      modelo_utilizado: "fallback",
      superprompt: null,
      score_resposta: 0,
      fallback_ativado: true
    };
  }
}


