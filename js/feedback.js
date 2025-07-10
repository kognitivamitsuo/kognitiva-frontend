function coletarFeedback() {
  if (!verificarAutenticacao()) return;

  const feedbackContainer = document.getElementById('feedback-container');
  const comentarioBox = document.getElementById('comentario-feedback');

  if (feedbackContainer && comentarioBox) {
    feedbackContainer.style.display = 'flex';

    document.getElementById('feedback-positivo').onclick = () => {
      enviarFeedback('positivo', null);
    };

    document.getElementById('feedback-negativo').onclick = () => {
      comentarioBox.style.display = 'block';

      comentarioBox.onblur = () => {
        const comentario = comentarioBox.value.trim();
        if (comentario) {
          enviarFeedback('negativo', comentario);
        }
      };
    };
  }
}

async function enviarFeedback(tipo, comentario) {
  try {
    const token = localStorage.getItem('jwt_token');
    const response = await fetch('/api/feedback', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tipo, comentario })
    });

    if (!response.ok) throw new Error('Erro ao enviar feedback');

    exibirFeedbackStatus('✅ Feedback enviado com sucesso!', true);

    // Resetar campos
    document.getElementById('feedback-container').style.display = 'none';
    document.getElementById('comentario-feedback').style.display = 'none';
    document.getElementById('comentario-feedback').value = '';
  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
    exibirFeedbackStatus('❌ Erro ao enviar feedback', false);
  }
}

function exibirFeedbackStatus(mensagem, sucesso) {
  const feedbackStatus = document.getElementById('feedback-status');
  if (feedbackStatus) {
    feedbackStatus.textContent = mensagem;
    feedbackStatus.style.color = sucesso ? 'green' : 'red';
    feedbackStatus.style.display = 'block';

    setTimeout(() => {
      feedbackStatus.style.display = 'none';
    }, 3000);
  }
}
