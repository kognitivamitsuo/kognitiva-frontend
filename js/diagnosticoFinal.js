// Função para gerar diagnóstico e exibir o resultado de forma amigável
function gerarDiagnostico(score, feedback) {
    const diagnosticoElement = document.getElementById("diagnostico");  // Elemento onde o diagnóstico será exibido

    // Condicional para exibir o diagnóstico com base no score
    if (score < 6) {
        diagnosticoElement.textContent = "⚠ Detectamos pontos de atenção nesta resposta.";
        diagnosticoElement.style.backgroundColor = "#F44336"; // Vermelho para pontos de atenção
    } else {
        diagnosticoElement.textContent = "✅ Sessão encerrada com sucesso.";
        diagnosticoElement.style.backgroundColor = "#4CAF50"; // Verde para sucesso
    }

    diagnosticoElement.style.display = "block";  // Exibe o diagnóstico
    salvarDiagnostico(score, feedback);  // Salva o diagnóstico no backend
}

// Função para salvar o diagnóstico no backend
function salvarDiagnostico(score, feedback) {
    // Envia diagnóstico final para ser armazenado no banco
    axios.post('/api/diagnostico', { score, feedback })
        .then(response => {
            console.log("Diagnóstico salvo com sucesso");
            exibirFeedbackVisual("Diagnóstico salvo com sucesso!", true);  // Exibe mensagem de sucesso para o usuário
        })
        .catch(error => {
            console.error("Erro ao salvar diagnóstico", error);
            exibirFeedbackVisual("Erro ao salvar diagnóstico. Tente novamente.", false);  // Exibe mensagem de erro
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
