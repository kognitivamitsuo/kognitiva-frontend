
// 📁 frontend/src/logic/mainPage.js – v3.6

import { executarIA } from "./executarIA.js";
import { configurarFeedback } from "./feedbackBox.js";
import { configurarEncerramentoDiagnostico } from "./diagnosticoFinal.js";
import { verificarReaproveitamentoSessao } from "./reaproveitarSessao.js";

export const state = {
  tokenSessao: null,
  clienteAtivo: null,
  contextoValido: false,
  superpromptOK: false,
  estiloAplicado: null,
  scoreResposta: null,
  diagnosticoFinal: null
};

async function obterTokenJWT() {
  try {
    const res = await fetch("/proxy/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "demo_user", // pode ser fixado ou inferido
        user_agent: navigator.userAgent
      })
    });

    const json = await res.json();
    if (json?.token_sessao) {
      state.tokenSessao = json.token_sessao;
      localStorage.setItem("token_sessao", json.token_sessao);
    }
  } catch (err) {
    console.error("Erro ao obter token JWT:", err);
  }
}

function configurarEventosGlobais() {
  const btnEnviar = document.getElementById("btnEnviarMensagem");
  const input = document.getElementById("inputMensagem");

  if (btnEnviar && input) {
    btnEnviar.onclick = () => {
      const mensagem = input.value.trim();
      if (mensagem) {
        executarIA(mensagem);
        input.value = "";
      }
    };
  }

  const btnResetar = document.getElementById("btnResetarSessao");
  if (btnResetar) {
    btnResetar.onclick = () => {
      localStorage.clear();
      location.reload();
    };
  }
}

window.addEventListener("DOMContentLoaded", async () => {
  const tokenExistente = localStorage.getItem("token_sessao");
  if (tokenExistente) {
    state.tokenSessao = tokenExistente;
  } else {
    await obterTokenJWT();
  }

  configurarEventosGlobais();
  configurarFeedback();
  configurarEncerramentoDiagnostico();
  verificarReaproveitamentoSessao();
});
