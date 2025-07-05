
// feedbackBox.js – Botões de avaliação + campo para feedback textual

function configurarFeedback(tokenSessao, clienteAtual) {
  const positivo = document.getElementById("btnFeedbackUp");
  const negativo = document.getElementById("btnFeedbackDown");

  positivo.addEventListener("click", () => enviarFeedback(10, ""));
  negativo.addEventListener("click", () => {
    const comentario = prompt("O que podemos melhorar?");
    enviarFeedback(4, comentario || "");
  });

  async function enviarFeedback(score, comentario) {
    try {
      const resposta = await fetch("https://sync.kognitiva.app/proxy/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenSessao}`
        },
        body: JSON.stringify({
          cliente_nome: clienteAtual,
          score_resposta: score,
          mensagem_feedback: comentario
        })
      });

      const dados = await resposta.json();
      adicionarMensagem("sistema", "✅ Feedback enviado com sucesso!");
    } catch (erro) {
      console.error("Erro ao enviar feedback:", erro);
      adicionarMensagem("sistema", "⚠ Falha ao enviar feedback.");
    }
  }
}
