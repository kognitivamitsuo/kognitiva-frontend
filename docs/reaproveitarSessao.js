export function verificarReaproveitamentoSessao() {
  const aviso = document.getElementById("contextoReutilizadoAviso");
  if (aviso) {
    aviso.style.display = "block";
    aviso.innerText = "ℹ️ Sessão de exemplo. Nenhum dado é armazenado.";
  }
}
