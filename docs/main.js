
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('inputMensagem');
  const botaoEnviar = document.getElementById('botaoEnviar');
  const chatBox = document.getElementById('chatMessages');
  const feedbackContainer = document.getElementById('feedbackContainer');
  const diagnosticoBox = document.getElementById('diagnosticoFinal');

  function renderMensagem(texto, remetente = 'user') {
    const div = document.createElement('div');
    div.className = 'message ' + remetente;
    div.textContent = texto;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function renderFeedback() {
    feedbackContainer.style.display = 'flex';
  }

  function esconderDiagnostico() {
    diagnosticoBox.style.display = 'none';
  }

  function exibirDiagnostico(texto) {
    diagnosticoBox.innerHTML = '<h3>Diagnóstico</h3><p>' + texto + '</p>';
    diagnosticoBox.style.display = 'block';
  }

  async function enviarMensagem() {
    const texto = input.value.trim();
    if (!texto) return;
    renderMensagem(texto, 'user');
    input.value = '';
    botaoEnviar.disabled = true;

    try {
      const resposta = await fetch('https://sync.kognitiva.app/executar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + (localStorage.getItem('jwt') || '')
        },
        body: JSON.stringify({ pergunta: texto })
      });
      const dados = await resposta.json();
      renderMensagem(dados.resposta || 'Erro ao processar resposta.', 'ai');
      if (dados.diagnostico) exibirDiagnostico(dados.diagnostico);
      renderFeedback();
    } catch (erro) {
      renderMensagem('⚠️ Erro de conexão com o servidor.', 'ai');
    }

    botaoEnviar.disabled = false;
  }

  botaoEnviar.addEventListener('click', enviarMensagem);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      enviarMensagem();
    }
  });

  document.getElementById('botaoResetar').addEventListener('click', () => {
    chatBox.innerHTML = '';
    diagnosticoBox.innerHTML = '';
    feedbackContainer.style.display = 'none';
    localStorage.removeItem('contexto');
  });
});
