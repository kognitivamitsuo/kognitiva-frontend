export async function verificarReaproveitamentoSessao(tokenSessao, clienteSelecionado) {
  try {
    const response = await fetch(`https://sync.kognitiva.app/proxy/cache_superprompt?cliente_nome=${encodeURIComponent(clienteSelecionado)}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${tokenSessao}`,
      },
    });

    const data = await response.json();
    if (data.superpromptOK) {
      const aviso = document.getElementById("contextoReutilizadoAviso");
      if (aviso) {
        aviso.style.display = "block";
        aviso.innerText = "ℹ️ Sessão reutilizando contexto salvo.";
      }
    }
  } catch (err) {
    console.error("Erro ao verificar reaproveitamento:", err);
  }
}
