// Renderiza a mensagem inicial do sistema
function renderMensagemInicial() {
    try {
        const messagesContainer = document.getElementById('messages');
        if (messagesContainer) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', 'system');
            messageElement.textContent = "Olá! Como posso ajudar você hoje?";
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } else {
            console.error("Elemento 'messages' não encontrado!");
        }
    } catch (error) {
        console.error("Erro ao renderizar mensagem inicial:", error);
    }
}

// Adiciona uma nova mensagem ao chat
function adicionarMensagem(texto, tipo) {
    try {
        const messagesContainer = document.getElementById('messages');
        if (messagesContainer) {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message', tipo);
            messageElement.textContent = texto;
            messagesContainer.appendChild(messageElement);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } else {
            console.error("Elemento 'messages' não encontrado para adicionar mensagem!");
        }
    } catch (error) {
        console.error("Erro ao adicionar mensagem:", error);
    }
}

// Inicializa o chat, evitando múltiplas execuções da mensagem inicial
function initChat() {
    try {
        if (!localStorage.getItem('chatIniciado')) {
            renderMensagemInicial();
            localStorage.setItem('chatIniciado', 'true');
        }
    } catch (error) {
        console.error("Erro ao inicializar o chat:", error);
    }
}

