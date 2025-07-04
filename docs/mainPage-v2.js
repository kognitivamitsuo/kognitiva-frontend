import { executarIA } from "./executarIA.js";
import { verificarReaproveitamentoSessao } from "./ReaproveitamentoSessao.js";
import { renderizarMensagem } from "./uiRenderer.js";

let tokenSessao = null;
let clienteSelecionado = null;

async function obterToken() {
try {
const resposta = await fetch("[https://sync.kognitiva.app/proxy/token](https://sync.kognitiva.app/proxy/token)", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
user\_id: "usuario\_teste",
ip: "127.0.0.1",
user\_agent: navigator.userAgent,
modo: "orquestracao",
}),
});

```
const data = await resposta.json();
tokenSessao = data.token_sessao;

if (tokenSessao) {
  console.log("✔ Token obtido com sucesso:", tokenSessao);
} else {
  console.warn("⚠ Token não recebido. Verifique o backend.");
}
```

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

async function selecionarCliente(nome) {
clienteSelecionado = nome;
document.getElementById("chatMessages").innerHTML = "";
renderizarMensagem("ai", `✅ Cliente selecionado: ${nome}`);

if (!tokenSessao) {
console.warn("⚠ Token de sessão não disponível. Tentando obter novamente...");
await obterToken();
}

if (tokenSessao) {
verificarReaproveitamentoSessao(tokenSessao, nome);
} else {
renderizarMensagem("ai", "⚠ Token de sessão indisponível. Não foi possível continuar.");
}
}

async function enviarMensagem() {
const input = document.getElementById("inputMensagem");
const texto = input.value.trim();
if (!texto || !clienteSelecionado || !tokenSessao) return;

renderizarMensagem("user", texto);
input.value = "";

const contexto\_valido = true;
const respostaIA = await executarIA(tokenSessao, clienteSelecionado, texto, contexto\_valido);
renderizarMensagem("ai", respostaIA);
}

document.addEventListener("DOMContentLoaded", async () => {
await obterToken();

const clientes = \["Grupo SCC", "Nova Era Logística", "Oriente Marketing"];
atualizarClientes(clientes);

const input = document.getElementById("inputMensagem");
const botao = document.getElementById("botaoEnviar");
botao.onclick = enviarMensagem;
input.addEventListener("keydown", (e) => {
if (e.key === "Enter") enviarMensagem();
});
});
