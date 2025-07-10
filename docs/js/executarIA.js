// executarIA.js

// ✅ BACKEND_URL agora referenciado como window.BACKEND_URL

async function enviarMensagemAPI(mensagem) {
  const token = localStorage.getItem("jwt_token");
  const entrada = mensagem?.trim();

  if (!entrada) {
    alert("Digite uma mensagem válida.");
    return;
  }

  document.getElementById("spinner").style.display = "block";

  try {
    const response = await fetch(`${window.BACKEND_URL}/proxy/execucao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ mensagem: entrada })
    });

    const data = await response.json();
    exibirRespostaIA(data.respostaIA || data.resposta);

    if (data.score_resposta) {
      exibirDiagnostico(data.score_resposta);
    }

    document.getElementById("feedback-container").style.display = "block";
  } catch (err) {
    console.error("Erro ao enviar mensagem:", err);
    alert("Erro ao enviar mensagem para o backend.");
  } finally {
    document.getElementById("spinner").style.display = "none";
  }
}
