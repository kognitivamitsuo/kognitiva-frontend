export function configurarEncerramentoDiagnostico() {
  const btnEncerrar = document.getElementById("btnEncerrarSessao");

  if (btnEncerrar) {
    btnEncerrar.onclick = () => {
      alert("ðŸ§  SessÃ£o encerrada com sucesso. SimulaÃ§Ã£o completa.");
      location.reload();
    };
  }
}
