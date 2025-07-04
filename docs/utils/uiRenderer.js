function renderizarMensagem(origem, mensagem) {
  const chat = document.getElementById("chatMessages");
  const msg = document.createElement("div");
  msg.className = origem === "user" ? "chat-message user" : "chat-message ai";
  msg.innerText = mensagem;
  chat.appendChild(msg);
  chat.scrollTop = chat.scrollHeight;
}
export { renderizarMensagem };
