export function renderizarMensagem(tipo, texto) {
  const container = document.getElementById("chatMessages");
  if (!container || !texto) return;

  const div = document.createElement("div");
  div.className = tipo === "user" ? "message user" : "message ai";
  div.textContent = texto;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}
