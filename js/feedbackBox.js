function coletarFeedback() {
  if (!verificarAutenticacao()) return;

  const feedbackContainer = document.getElementById('feedback-container');
  if (feedbackContainer) {
    feedbackContainer.style.display = 'flex';
    
    document.getElementById('feedback-positivo').onclick = () => {
      enviarFeedback('positivo');
    };
    
    document.getElementById('feedback-negativo').onclick = () => {
      document.getElementById('comentario-feedback').style.display = 'block';
    };
  }
}

async function enviarFeedback(tipo) {
  try {
    const comentario = tipo === 'negativo' 
      ? document.getElementById('comentario-feedback').value 
      : null;

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

    exibirFeedbackStatus('Feedback enviado com sucesso!', true);
    
    // Resetar campos
    document.getElementById('feedback-container').style.display = 'none';
    document.getElementById('comentario-feedback').style.display = 'none';
    document.getElementById('comentario-feedback').value = '';
  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
    exibirFeedbackStatus('Erro ao enviar feedback', false);
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
