let feedbackGlobal = '';
function registrarFeedback(tipo) {
    feedbackGlobal = tipo;
    document.getElementById('comentario').style.display = 'block';
}
async function enviarComentario() {
    const comentario = document.getElementById('comentario').value;
    const token = localStorage.getItem('jwt_token');
    if (!token || !feedbackGlobal) return;
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ feedback: feedbackGlobal, comentario })
        });
        if (response.ok) {
            alert("Feedback enviado com sucesso!");
            document.getElementById('feedback-container').style.display = 'none';
        }
    } catch (error) {
        console.error("Erro ao enviar feedback:", error);
    }
}
