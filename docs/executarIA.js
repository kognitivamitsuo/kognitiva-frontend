const URL_API = "https://sync.kognitiva.app";

async function executarIA(tokenSessao, cliente_nome, mensagem, contexto_valido) {
  try {
    const resposta = await fetch(`${URL_API}/executar`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenSessao}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        cliente_nome,
        mensagem,
        contexto_valido
      })
    });

    if (!resposta.ok) {
      throw new Error(`Erro na execução: ${resposta.status}`);
    }

    const resultado = await resposta.json();
    return resultado.resposta;
  } catch (erro) {
    console.error("Erro ao executar IA:", erro);
    return "⚠ Ocorreu um erro na execução da IA.";
  }
}
export { executarIA };
