// uiRenderer.js – Renderização de mensagens e status

export function renderizarMensagem(tipo, texto) {
  const container = document.getElementById("mensagensContainer");
  if (!container || !texto) return;

  const div = document.createElement("div");
  div.className = `mensagem ${tipo}`;
  div.textContent = texto;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}
