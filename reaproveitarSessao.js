// reaproveitarSessao.js – Bloco B13 (production-ready v3.6)
import { lockExecucao, timeoutExecucao } from "./utils/execControl.js";
import { renderizarMensagem } from "./utils/uiRenderer.js";
import { verificarClienteAtivo } from "./mainPage.js";
export async function verificarReaproveitamentoSessao() {
  const execKey = `reaproveitar_${Date.now()}`;
  if (!lockExecucao(execKey)) return;
  try {
    const controller = new AbortController();
    const timeout = timeoutExecucao(controller, 5000);
    const resposta = await fetch("/proxy/contexto", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${state.tokenSessao}`
      },
      signal: controller.signal
    });
    clearTimeout(timeout);
    const json = await resposta.json();
    if (json.cliente_nome && json.token_sessao_valido && json.contexto_valido) {
      state.clienteAtivo = json.cliente_nome;
      state.contextoCliente = json;
      state.contextoReaproveitado = true;
      state.modoExecucao = "reaproveitamento";
      if (json.superprompt) {
        state.superpromptOK = true;
        state.superprompt = json.superprompt;
        state.superpromptTTL = json.superprompt_ttl || "~";
      }
      renderizarMensagem(
        "sistema",
        `💡 Reaproveitando contexto anterior com ${json.cliente_nome}. Superprompt disponível: ${state.superpromptOK ? "✅" : "❌"}`
      );
      verificarClienteAtivo();
    } else {
      console.log("Nenhuma sessão reutilizável válida encontrada.");
    }
  } catch (err) {
    console.error("Erro ao verificar reaproveitamento:", err);
    renderizarMensagem("erro", "❌ Falha ao reaproveitar sessão.");
  }
}
// Executar na inicialização
window.addEventListener("load", () => {
  if (state.tokenSessao) {
    verificarReaproveitamentoSessao();
  }
});