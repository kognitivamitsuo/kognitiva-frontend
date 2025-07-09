// Função para renderizar a mensagem inicial após a verificação do token
function renderMensagemInicial() {
    const mensagemInicial = "Olá! Como posso ajudar você hoje?";
    const messagesContainer = document.getElementById("messages");

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "system");
    messageElement.textContent = mensagemInicial;

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
