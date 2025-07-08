function gerarDiagnostico(score, feedback) {
    if (score < 6) {
        alert("⚠ Detectamos pontos de atenção nesta resposta.");
    } else {
        alert("✅ Sessão encerrada com sucesso.");
    }
    salvarDiagnostico(score, feedback);
}

function salvarDiagnostico(score, feedback) {
    // Enviar diagnóstico final para ser armazenado no banco
    axios.post('/api/diagnostico', { score, feedback })
        .then(response => console.log("Diagnóstico salvo"))
        .catch(error => console.error("Erro ao salvar diagnóstico", error));
}
