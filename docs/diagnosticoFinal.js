export async function enviarDiagnostico(tokenSessao, clienteSelecionado, modelo, score, tempoMs) {
  try {
    const response = await fetch("https://sync.kognitiva.app/proxy/diagnostico", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token_sessao: tokenSessao,
        cliente_nome: clienteSelecionado,
        modelo,
        score_resposta: score,
        tempo_total_ms: tempoMs,
      }),
    });

    const data = await response.json();
    if (data.classificacao) {
      alert(`Diagnóstico: ${data.classificacao}`);
    }
  } catch (err) {
    console.error("Erro ao enviar diagnóstico:", err);
  }
}

export function configurarEncerramentoDiagnostico() {
  const btnEncerrar = document.getElementById("btnEncerrarSessao");

  if (btnEncerrar) {
    btnEncerrar.onclick = () => {
      alert("🛑 Sessão encerrada com sucesso. Simulação completa.");
      location.reload();
    };
  }
}
