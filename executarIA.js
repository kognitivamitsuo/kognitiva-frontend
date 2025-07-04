import { renderizarMensagem } from "./utils/uiRenderer.js";
import { lockExecucao, timeoutExecucao } from "./utils/execControl.js";
import { state } from "./mainPage.js";

export async function executarIA(mensagem) {
  if (!lockExecucao("execucao")) return;

  renderizarMensagem("usuario", mensagem);
  renderizarMensagem("ia", "ðŸ’¬ Simulando resposta da IA...");

  // SimulaÃ§Ã£o de tempo de resposta
  await new Promise(resolve => setTimeout(resolve, 1200));

  renderizarMensagem("ia", "ðŸ§  SimulaÃ§Ã£o: esta seria a resposta gerada pela IA baseada no seu input.");
}
