// utils/diagnosticoFinal.js
// Diagnóstico final (B16) – Compatível com navegador (sem export)

window.renderResumoFinal = function(score, tempoResposta) {
  const box = document.getElementById('diagnosticoFinal');
  if (!box) return;

  box.innerHTML = `
    <h3>📊 Diagnóstico Final</h3>
    <p><strong>Score médio da sessão:</strong> ${score || 'N/A'}</p>
    <p><strong>Tempo médio de resposta:</strong> ${tempoResposta || 'N/A'} segundos</p>
    <button onclick="document.getElementById('diagnosticoFinal').style.display='none'">
      Fechar
    </button>
  `;
  box.style.display = 'block';
};

// Diagnóstico retroativo automático (se sessão com score baixo ou feedback 👎)
document.addEventListener('DOMContentLoaded', () => {
  const historico = JSON.parse(localStorage.getItem('kognitiva_diagnostico') || '{}');
  if (historico.score_resposta !== undefined && historico.score_resposta < 6) {
    window.renderResumoFinal(historico.score_resposta, historico.tempo_resposta);
  }
});
