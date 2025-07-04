// ✅ executarIA.js – Execução real com tratamento de fallback

export async function executarIA(tokenJWT, mensagem, cliente) {
  if (!mensagem || !cliente || !tokenJWT) {
    return { status: "erro", resposta: "Dados incompletos para execução." };
  }

  const payload = {
    token_sessao: tokenJWT,
    mensagem_usuario: mensagem,
    cliente_nome: cliente
  };

  try {
    const resposta = await fetch("https://sync.kognitiva.app/executar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenJWT}`
      },
      body: JSON.stringify(payload)
    });

    const dados = await resposta.json();
    return {
      status: "ok",
      resposta: dados.resposta,
      modelo: dados.modelo_utilizado,
      score: dados.score_resposta || null
    };
  } catch (erro) {
    console.error("⚠️ Erro ao executar IA:", erro);
    return {
      status: "fallback",
      resposta: "⚠ Esta é uma resposta de fallback. O sistema está operando de forma simulada.",
      modelo: "GPT-4 (fallback)"
    };
  }
}
