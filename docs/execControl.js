// execControl.js – responsável por acionar a IA da Kognitiva com contexto real

async function executarIA(textoUsuario, clienteSelecionado, tokenSessao) {
  if (!clienteSelecionado || !tokenSessao || !textoUsuario) {
    console.error("❌ Campos obrigatórios ausentes para executar IA.");
    return {
      resposta: "⚠️ Erro: campos obrigatórios ausentes.",
      modelo_utilizado: "indefinido",
    };
  }

  try {
    const resposta = await fetch("https://sync.kognitiva.app/executar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenSessao}`,
      },
      body: JSON.stringify({
        cliente_nome: clienteSelecionado,
        objetivo_interacao: textoUsuario,
        token_sessao: tokenSessao,
      }),
    });

    if (!resposta.ok) {
      throw new Error("❌ Erro na resposta da IA");
    }

    const dados = await resposta.json();
    return {
      resposta: dados.resposta || "⚠️ Resposta vazia.",
      modelo_utilizado: dados.modelo_utilizado || "desconhecido",
      score_resposta: dados.score_resposta || 0,
    };
  } catch (erro) {
    console.error("❌ Erro ao executar IA:", erro);
    return {
      resposta: "⚠️ Houve uma falha temporária. Tente novamente.",
      modelo_utilizado: "fallback",
    };
  }
}

