// ✅ mainPage.js – Versão produção com modo real
import { definirClienteAtivo, verificarEstadoInicial } from "./execControl.js";

let tokenJWT = null;

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

window.onload = async () => {
  verificarEstadoInicial();
  await obterTokenSessao();
  definirClienteAtivo("Oriente Marketing");
  document.getElementById("btnEnviarMensagem").onclick = enviarMensagem;
};

