async function enviarMensagemAPI(mensagem) {
    const token = localStorage.getItem('jwt_token');
    document.getElementById('spinner').style.display = 'block';
    try {
        const response = await fetch('/api/consulta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ mensagem })
        });

        const data = await response.json();
        exibirRespostaIA(data.respostaIA || data.resposta);
        if (data.score_resposta) {
            exibirDiagnostico(data.score_resposta);
        }

        document.getElementById('feedback-container').style.display = 'block';
    } catch (err) {
        alert("Erro ao enviar mensagem.");
    } finally {
        document.getElementById('spinner').style.display = 'none';
    }
}
