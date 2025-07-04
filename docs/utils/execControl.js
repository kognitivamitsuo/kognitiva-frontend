// ✅ execControl.js – Corrigido

const estadoExecucao = {
  clienteAtivo: false,
  modoSimulacao: false,
  tokenSessao: null,
  execucaoBloqueada: false
};

export function bloquearExecucao() {
  estadoExecucao.execucaoBloqueada = true;
  document.getElementById("execucaoBloqueada").style.display = "block";
}

export function liberarExecucao() {
  estadoExecucao.execucaoBloqueada = false;
  document.getElementById("execucaoBloqueada").style.display = "none";
}

export function definirClienteAtivo(nome) {
  estadoExecucao.clienteAtivo = !!nome;
  estadoExecucao.tokenSessao = gerarTokenAleatorio();
  document.getElementById("clienteAtivo").textContent = nome;
}

function gerarTokenAleatorio() {
  return 'sessao_' + Math.random().toString(36).substr(2, 10);
}

export function obterEstadoAtual() {
  return estadoExecucao;
}

export function verificarEstadoInicial() {
  if (estadoExecucao.modoSimulacao) {
    bloquearExecucao();
    document.getElementById("modoSimulacaoAviso").style.display = "block";
  }
}

