// executarIA.js

const BACKEND_URL = "https://sync.kognitiva.app";

async function enviarMensagemAPI(mensagem) {
  const token = localStorage.getItem("jwt_token");
  document.getElementById("spinner").style.display = "block";

  try {
    const response = await fetch(`${BACKEND_URL}/proxy/execucao`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ mensagem })
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
