function coletarFeedback() {
    const feedback = prompt("Como foi sua experiência com a IA? (👍 ou 👎)");
    if (feedback === "👍") {
        enviarFeedback("positivo");
    } else if (feedback === "👎") {
        enviarFeedback("negativo");
    }
}

function enviarFeedback(tipo) {
    // Envia feedback ao backend para análise e melhorias
    axios.post('/api/feedback', { feedback: tipo })
        .then(response => console.log("Feedback enviado"))
        .catch(error => console.error("Erro ao enviar feedback", error));
}
