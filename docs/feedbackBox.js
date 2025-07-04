export function configurarFeedback() {
  const btnUp = document.getElementById("btnFeedbackUp");
  const btnDown = document.getElementById("btnFeedbackDown");

  if (btnUp) {
    btnUp.onclick = () => alert("総 Feedback positivo registrado (simulado).");
  }

  if (btnDown) {
    btnDown.onclick = () => {
      const comentario = prompt("O que podemos melhorar?");
      alert(`綜 Feedback negativo registrado (simulado): ${comentario}`);
    };
  }
}
