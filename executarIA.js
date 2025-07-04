// executarIA.js – Modular e production-ready v3.6
import { lockExecucao, timeoutExecucao } from "./utils/execControl.js";
import { renderizarMensagem } from "./utils/uiRenderer.js";
export async function executarIA(mensagemUsuario) {
  const execKey = `executarIA_${Date.now()}`;
  if (!lockExecucao(execKey)) return;
  if (!state.tokenSessao || !state.contextoValido !== true || !state.superpromptOK !== true) {
    renderizarMensagem("erro", "❌ Execução bloqueada: contexto inválido ou superprompt ausente.");
    return;
  }
  try {
    statusExecucao.innerText = "⏳ Gerando resposta...";
    renderizarMensagem("usuario", mensagemUsuario);
    const controller = new AbortController();
    const timeout = timeoutExecucao(controller, 7000);
    const resposta = await fetch("/executar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.tokenSessao}`
      },
      body: JSON.stringify({ mensagem_usuario: mensagemUsuario }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    const json = await resposta.json();
    if (!json || !json.resposta) {
      throw new Error("Resposta inválida da IA");
    }
    // Exibição
    renderizarMensagem("ia", json.resposta);
    statusExecucao.innerText = "✅ Concluído";
    if (json.modelo_utilizado === "fallback") {
      renderizarMensagem("aviso", "⚠️ Resposta gerada via fallback GPT-4");
    }
    // Armazenamento em state
    state.ultimaResposta = json.resposta;
    state.modeloUtilizado = json.modelo_utilizado;
    state.scoreResposta = json.score_resposta || null;
    state.timestamp_execucao = new Date().toISOString();
    state.fallback_ativado = json.modelo_utilizado === "fallback";
  } catch (err) {
    console.error("Erro IA:", err);
    renderizarMensagem("erro", "❌ Erro ao executar IA. Tente novamente mais tarde.");
    statusExecucao.innerText = "❌ Erro";
  }
}