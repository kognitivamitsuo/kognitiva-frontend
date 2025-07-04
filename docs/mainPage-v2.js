
// mainPage-v2.js – versão atualizada sem chamada para /proxy/contexto
import { executarIA } from "./executarIA.js";
import { verificarReaproveitamentoSessao } from "./ReaproveitamentoSessao.js";
import { renderizarMensagem } from "./uiRenderer.js";

let tokenSessao = null;
let clienteSelecionado = null;

async function obterToken() {
  try {
    const resposta = await fetch("https://sync.kognitiva.app/proxy/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "usuario_teste",
        ip: "127.0.0.1",
        user_agent: navigator.userAgent,
        modo: "orquestracao",
      }),
    });

    const data = await resposta.json();
    tokenSessao = data.token_sessao;
    console.log("✔ Token obtido com sucesso.");
  } catch (erro) {
    console.error("❌ Erro na requisição do token:", erro);
  }
}

function atualizarClientes(clientes) {
  const lista = document.getElementById("listaClientes");
  lista.innerHTML = "";

  clientes.forEach((nome) => {
    const botao = document.createElement("button");
    botao.textContent = nome;
    botao.onclick = () => selecionarCliente(nome);
    lista.appendChild(botao);
  });
}

function selecionarCliente(nome) {
  clienteSelecionado = nome;
  document.getElementById("chatMessages").innerHTML = "";
  renderizarMensagem("ai", `✅ Cliente selecionado: ${nome}`);
  verificarReaproveitamentoSessao(tokenSessao, nome);
}

async function enviarMensagem() {
  const input = document.getElementById("inputMensagem");
  const texto = input.value.trim();
  if (!texto || !clienteSelecionado || !tokenSessao) return;

  renderizarMensagem("user", texto);
  input.value = "";

  const contexto_valido = true;
  const respostaIA = await executarIA(tokenSessao, clienteSelecionado, texto, contexto_valido);
  renderizarMensagem("ai", respostaIA);
}

document.addEventListener("DOMContentLoaded", async () => {
  await obterToken();

  const clientes = ["Grupo SCC", "Nova Era Logística", "Oriente Marketing"];
  atualizarClientes(clientes);

  const input = document.getElementById("inputMensagem");
  const botao = document.getElementById("botaoEnviar");
  botao.onclick = enviarMensagem;
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") enviarMensagem();
  });
});


