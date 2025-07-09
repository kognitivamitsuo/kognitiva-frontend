// Função para coletar o feedback do usuário
function coletarFeedback() {
    const feedbackContainer = document.getElementById("feedback-container");
    feedbackContainer.style.display = 'flex';  // Exibe a área de feedback

    // Definindo comportamento dos botões de feedback
    document.getElementById("feedback-positivo").onclick = function() {
        enviarFeedback('positivo');
    };

    document.getElementById("feedback-negativo").onclick = function() {
        mostrarCampoComentario(true);  // Exibe o campo para comentário caso o feedback seja negativo
    };
}

// Função para exibir o campo de comentário quando o feedback for negativo
function mostrarCampoComentario(mostrar) {
    const comentarioField = document.getElementById("comentario-feedback");
    comentarioField.style.display = mostrar ? 'block' : 'none';  // Exibe ou esconde o campo de comentário
}

// Função para enviar o feedback para o backend
function enviarFeedback(tipo) {
    const comentario = document.getElementById("comentario-feedback").value.trim();
    
    // Enviar feedback para o backend
    axios.post('/api/feedback', { feedback: tipo, comentario: comentario })
        .then(response => {
            console.log("Feedback enviado com sucesso");
            exibirFeedbackVisual("Feedback enviado com sucesso!", true);
            // Resetar o campo de comentário e esconder o feedback
            document.getElementById("comentario-feedback").value = '';
            document.getElementById("feedback-container").style.display = 'none';
        })
        .catch(error => {
            console.error("Erro ao enviar feedback", error);
            exibirFeedbackVisual("Erro ao enviar feedback. Tente novamente.", false);
        });
}

// Função para exibir feedback visual (mensagem de sucesso ou erro)
function exibirFeedbackVisual(mensagem, sucesso) {
    const feedbackStatus = document.getElementById("feedback-status");
    feedbackStatus.textContent = mensagem;
    feedbackStatus.style.color = sucesso ? 'green' : 'red';
    feedbackStatus.style.display = 'block';
    
    // Esconde o feedback visual após 3 segundos
    setTimeout(() => feedbackStatus.style.display = 'none', 3000);
}

