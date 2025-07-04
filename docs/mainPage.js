// ✅ mainPage.js – Versão produção com modo real

import { definirClienteAtivo, verificarEstadoInicial } from "./utils/execControl.js";

let tokenJWT = null;

// 🔐 Obter token da sessão
async function obterTokenSessao() {
  const res = await fetch("https://sync.kognitiva.app/proxy/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: "admin@kognitiva.app",
      ip_origem: "127.0.0.1",
      user_agent: navigator.userAgent
    })
  });
  const data = await res.json();
  tokenJWT = data.token;
  console.log("🔐 Token recebido:", tokenJWT);
}

// 📦 Submeter mensagem para a IA
async function enviarMensagem() {
  const input = document.getElementById("inputMensagem").value;
  const cliente = document.getElementById("clienteAtivo").textContent;
  if (!input || !cliente) return alert("Preencha todos os campos.");

  const payload = {
    token_sessao: tokenJWT,
    mensagem_usuario: input,
    cliente_nome: cliente
  };

  const res = await fetch("https://sync.kognitiva.app/executar", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenJWT}`
    },
    body: JSON.stringify(payload)
  });

  const dados = await res.json();
  document.getElementById("respostaIA").textContent = dados.resposta;
  console.log("📩 Resposta recebida:", dados);
}

// 🔄 Inicialização
window.onload = async () => {
  verificarEstadoInicial();
  await obterTokenSessao();

  // Ativar cliente padrão para testes
  definirClienteAtivo("Oriente Marketing");

  // Bind do botão
  document.getElementById("btnEnviarMensagem").onclick = enviarMensagem;
};
