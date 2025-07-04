// diagnosticoFinal.js – Blocos B16 e B18 – Production-ready v3.6
import { lockExecucao, timeoutExecucao } from "./utils/execControl.js";
import { renderizarMensagem } from "./utils/uiRenderer.js";
export async function registrarDiagnosticoFinal() {
  const execKey = `diagnostico_${Date.now()}`;
  if (!lockExecucao(execKey)) return;
  const payload = {
    token_sessao: state.tokenSessao,
    cliente_nome: state.clienteAtivo,
    score_resposta: state.scoreResposta || null,
    diagnostico_final: state.diagnosticoFinal || "em avaliação",
    estilo_aplicado: state.estiloAplicado || "não informado",
    timestamp_encerramento: new Date().toISOString()
  };
  try {
    const controller = new AbortController();
    const timeout = timeoutExecucao(controller, 4000);
    const res = await fetch("/proxy/diagnostico", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${state.tokenSessao}`
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    clearTimeout(timeout);
    const json = await res.json();
    console.log("✅ Diagnóstico final registrado:", json);
    renderizarResumoFinal();
    mostrarSugestaoProximaAcao();
  } catch (err) {
    console.error("Erro ao registrar diagnóstico:", err);
    renderizarMensagem("erro", "❌ Falha ao registrar diagnóstico final.");
  }
}
function renderizarResumoFinal() {
  const resumo = `\n📌 Sessão Encerrada\n------------------------\n👤 Cliente: ${state.clienteAtivo}\n🧠 Framework: ${state.framework_version || "v3.4-finalUX"}\n🎯 Estilo aplicado: ${state.estiloAplicado || "-"}\n📊 Score: ${state.scoreResposta || "-"}\n🩺 Diagnóstico: ${state.diagnosticoFinal || "em avaliação"}\n⏱️ Token: ${state.tokenSessao?.slice(0, 12)}...\n`;
  renderizarMensagem("sistema", resumo);
  statusExecucao.innerText = "🧠 Sessão encerrada com sucesso.";
}
function mostrarSugestaoProximaAcao() {
  renderizarMensagem("sistema", "🚀 Deseja enviar uma proposta, agendar uma call ou iniciar nova jornada?");
}
export function configurarEncerramentoDiagnostico() {
  const btnEncerrar = document.getElementById("btnEncerrarSessao");
  if (btnEncerrar) {
    btnEncerrar.onclick = () => {
      registrarDiagnosticoFinal();
      encerrarSessaoCognitiva();
    };
  }
}