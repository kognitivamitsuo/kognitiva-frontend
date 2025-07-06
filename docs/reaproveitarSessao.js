const URL_API = "https://sync.kognitiva.app";

async function verificarReaproveitamentoSessao(tokenSessao, cliente_nome) {
  try {
    const resposta = await fetch(`${URL_API}/proxy/cache_superprompt?cliente_nome=${encodeURIComponent(cliente_nome)}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${tokenSessao}`,
        "Content-Type": "application/json"
      }
    });

    if (resposta.ok) {
      const dados = await resposta.json();
      if (dados && dados.superprompt) {
        console.log("💡 Reaproveitando contexto anterior com", cliente_nome);
        const chat = document.getElementById("chatMessages");
        const alerta = document.createElement("div");
        alerta.className = "message ai";
        alerta.innerText = `💡 Reaproveitando contexto anterior com ${cliente_nome}`;
        chat.appendChild(alerta);
        return dados.superprompt; // Reaproveitamento real
      }
    } else {
      console.warn("⚠️ Contexto anterior não encontrado.");
    }
  } catch (erro) {
    console.error("Erro ao verificar contexto anterior:", erro);
  }

  return null;
}

export { verificarReaproveitamentoSessao };
