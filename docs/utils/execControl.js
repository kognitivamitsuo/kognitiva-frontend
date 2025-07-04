
// execControl.js – Enviar mensagem real ao /executar
async function enviarMensagem(textoUsuario) {
    const token = localStorage.getItem("token_sessao") || "";
    const payload = {
        token_sessao: token,
        pergunta_usuario: textoUsuario
    };

    try {
        const res = await fetch("https://sync.kognitiva.app/executar", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.resposta) {
            console.log("Resposta da IA:", data.resposta);
            exibirResposta(data.resposta);
        } else {
            console.warn("Resposta inválida:", data);
        }
    } catch (err) {
        console.error("Erro ao executar IA:", err);
    }
}

function exibirResposta(resposta) {
    const container = document.querySelector(".chat-container");
    const bubble = document.createElement("div");
    bubble.className = "bubble-ia";
    bubble.textContent = resposta;
    container.appendChild(bubble);
}

