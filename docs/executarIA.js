// executarIA.js – versão atualizada com envio de contexto_valido

export async function executarIA(tokenSessao, clienteSelecionado, objetivoInteracao, contextoValido = true) {
  try {
    const resposta = await fetch("https://sync.kognitiva.app/executar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenSessao}`,
      },
      body: JSON.stringify({
        cliente_nome: clienteSelecionado,
        objetivo_interacao: objetivoInteracao,
        token_sessao: tokenSessao,
        contexto_valido: contextoValido,
      }),
    });

    if (!resposta.ok) {
      const erroTexto = await resposta.text();
      throw new Error(`Erro ${resposta.status}: ${erroTexto}`);
    }

    const dados = await resposta.json();
    return dados.resposta || "⚠ A resposta da IA veio vazia.";
  } catch (erro) {
    console.error("Erro na execução da IA:", erro);
    return "⚠ Erro ao executar a IA. Verifique sua conexão ou tente novamente.";
  }
}
