// ui.js

function exibirRespostaIA(resposta) {
  const container = document.getElementById("chat-container");
  if (!container) return;

  const div = document.createElement("div");
  div.className = "mensagem-ia";
  div.innerText = resposta;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

function exibirMensagemUsuario(texto) {
  const container = document.getElementById("chat-container");
  if (!container) return;

  const div = document.createElement("div");
  div.className = "mensagem-usuario";
  div.innerText = texto;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

document.getElementById("sendButton").addEventListener("click", async () => {
  const input = document.getElementById("userInput");
  const mensagem = input.value.trim();
  if (!mensagem) return;

  exibirMensagemUsuario(mensagem);
  input.value = "";
  await enviarMensagemAPI(mensagem);
});

document.getElementById("userInput").addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    document.getElementById("sendButton").click();
  }
});
