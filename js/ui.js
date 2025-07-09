// Função para renderizar a mensagem inicial
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

// Função para adicionar mensagens ao chat
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

// Função para inicializar o chat
function initChat() {
    try {
        // Verificar se o chat já foi iniciado e evitar reiniciar a mensagem inicial
        if (!localStorage.getItem('chatIniciado')) {
            renderMensagemInicial();  // Chama a função para renderizar a mensagem inicial
            localStorage.setItem('chatIniciado', 'true');  // Marca o chat como iniciado
        }
    } catch (error) {
        console.error("Erro ao inicializar o chat:", error);
    }
}

