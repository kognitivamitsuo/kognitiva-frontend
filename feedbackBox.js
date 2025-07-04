// feedbackBox.js – Production-ready v3.6
import { lockExecucao } from "./utils/execControl.js";
import { renderizarMensagem } from "./utils/uiRenderer.js";
export function configurarFeedback() {
  const btnUp = document.getElementById("btnFeedbackUp");
  const btnDown = document.getElementById("btnFeedbackDown");
  const comentario = document.getElementById("comentarioFeedback");
  if (!btnUp || !btnDown) return;
  btnUp.onclick = () => {
    enviarFeedbackUsuario(1, comentario?.value || "");
  };
  btnDown.onclick = () => {
    enviarFeedbackUsuario(0, comentario?.value || "");
  };
}
export async function enviarFeedbackUsuario(score, comentario = "") {
  const execKey = `feedback_${score}_${Date.now()}`;
  if (!lockExecucao(execKey)) return;
  if (!state.tokenSessao || !state.clienteAtivo || score === null) {
    renderizarMensagem("erro", "❌ Não é possível registrar feedback. Sessão ou cliente ausente.");
    return;
  }
  const payload = {
    token_sessao: state.tokenSessao,
    cliente_nome: state.clienteAtivo,
    score_resposta: score,
    feedback_usuario: comentario,
    timestamp_feedback: new Date().toISOString()
  };
  try {
    const res = await fetch("/proxy/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.tokenSessao}`
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    renderizarMensagem("sistema", `🎯 Feedback recebido (${score > 0 ? "positivo" : "negativo"})`);
    state.feedbackUsuario = comentario;
    state.scoreResposta = score;
    state.diagnosticoFinal = score >= 1 ? "ótimo" : "revisar";
    if (score === 0) {
      renderizarMensagem("sistema", "💡 Deseja reformular a pergunta?");
    }
  } catch (err) {
    console.error("Erro ao enviar feedback:", err);
    renderizarMensagem("erro", "❌ Falha ao enviar feedback.");
  }
}