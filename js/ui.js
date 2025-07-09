function renderMensagemInicial() {
    try {
        const messagesContainer = document.getElementById('messages');
        if (messagesContainer) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'system');
            messageElement.textContent = "Olá! Como posso ajudar você hoje?";
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    } catch (error) {
        console.error("Erro ao renderizar mensagem inicial:", error);
    }
}

function adicionarMensagem(texto, tipo) {
    try {
        const messagesContainer = document.getElementById('messages');
        if (messagesContainer) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', tipo);
            messageElement.textContent = texto;
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    } catch (error) {
        console.error("Erro ao adicionar mensagem:", error);
    }
}

function initChat() {
    if (!localStorage.getItem('chatIniciado')) {
        renderMensagemInicial();
        localStorage.setItem('chatIniciado', 'true');
    }
}
