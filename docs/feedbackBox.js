export function configurarFeedback(tokenSessao, clienteSelecionado) {
  const btnUp = document.getElementById("btnFeedbackUp");
  const btnDown = document.getElementById("btnFeedbackDown");

  if (btnUp) {
    btnUp.onclick = async () => {
      try {
        await fetch("https://sync.kognitiva.app/proxy/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente_nome: clienteSelecionado,
            feedback_usuario: "positivo",
            score_resposta: 10,
          }),
        });
        alert("👍 Feedback positivo registrado com sucesso.");
      } catch {
        alert("⚠ Erro ao registrar feedback positivo.");
      }
    };
  }

  if (btnDown) {
    btnDown.onclick = async () => {
      const comentario = prompt("O que podemos melhorar?");
      if (!comentario) return;
      try {
        await fetch("https://sync.kognitiva.app/proxy/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            cliente_nome: clienteSelecionado,
            feedback_usuario: comentario,
            score_resposta: 4,
          }),
        });
        alert("👎 Feedback negativo registrado com sucesso.");
      } catch {
        alert("⚠ Erro ao registrar feedback negativo.");
      }
    };
  }
}
