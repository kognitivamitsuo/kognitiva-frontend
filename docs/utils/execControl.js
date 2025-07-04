
// execControl.js – Integração Real com Envio via Enter e Botão

// Envia a mensagem para a IA
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
            exibirResposta(data.resposta);
        } else {
            exibirResposta("⚠️ Resposta inválida ou erro ao chamar a IA.");
        }
    } catch (err) {
        exibirResposta("❌ Erro de rede ou servidor indisponível.");
        console.error("Erro ao executar IA:", err);
    }
}

// Exibe a resposta da IA na tela
function exibirResposta(resposta) {
    const container = document.querySelector(".chat-container");
    const bubble = document.createElement("div");
    bubble.className = "bubble-ia";
    bubble.textContent = resposta;
    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

// Ativa o envio por botão e tecla Enter
document.addEventListener("DOMContentLoaded", () => {
    const input = document.querySelector("#inputMensagem");
    const botao = document.querySelector("#botaoEnviar");

    if (!input || !botao) return;

    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            if (input.value.trim()) {
                enviarMensagem(input.value.trim());
                input.value = "";
            }
        }
    });

    botao.addEventListener("click", () => {
        if (input.value.trim()) {
            enviarMensagem(input.value.trim());
            input.value = "";
        }
    });
});

