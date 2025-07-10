// feedback.js

// ✅ BACKEND_URL agora referenciado como window.BACKEND_URL

async function registrarFeedback(tipo) {
  const token = localStorage.getItem("jwt_token");
  const score = tipo === "positivo" ? 10 : 3;

  try {
    await fetch(`${window.BACKEND_URL}/proxy/feedback`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        feedback_usuario: tipo,
        score_resposta: score
      })
    });

    alert("Feedback enviado com sucesso!");
  } catch (e) {
    alert("Erro ao enviar feedback.");
  }
}

async function enviarComentario() {
  const comentario = document.getElementById("comentario").value;
  if (!comentario) return alert("Insira um comentário.");
  await registrarFeedback("negativo");
}
