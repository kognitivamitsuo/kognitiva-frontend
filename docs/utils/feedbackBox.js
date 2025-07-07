// utils/feedbackBox.js
// Bloco B17 – Envio de feedback pelo usuário (versão navegador puro)

window.enviarFeedback = function(tipo, idMensagem) {
  const token = localStorage.getItem('kgn_jwt');
  if (!token || !idMensagem) return;

  const payload = {
    id_mensagem: idMensagem,
    score_resposta: tipo === 'positivo' ? 10 : 3,
    feedback_usuario: tipo,
    modelo_utilizado: 'execucao',
    framework_version: 'v3.4-finalUX'
  };

  fetch('https://sync.kognitiva.app/proxy/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  })
  .then(r => {
    if (!r.ok) throw new Error('Erro ao enviar feedback');
    return r.json();
  })
  .then(() => {
    const botoes = document.querySelectorAll(`[data-message-id="${idMensagem}"]`);
    botoes.forEach(btn => {
      btn.disabled = true;
      btn.style.opacity = 0.5;
    });
    console.log("✅ Feedback registrado com sucesso.");
  })
  .catch(e => {
    console.error("❌ Falha no envio do feedback:", e);
  });
};

