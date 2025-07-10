function exibirRespostaIA(resposta) {
    const chatContainer = document.getElementById('chat-container');
    const mensagem = document.createElement('div');
    mensagem.classList.add('ia-resposta');
    mensagem.textContent = resposta;
    chatContainer.appendChild(mensagem);
}
function renderMensagemInicial() {
    exibirRespostaIA("Olá! Estou pronta para te ajudar. Me diga o que você precisa.");
}
function inicializarChat() {
    if (verificarTokenJWT()) {
        renderMensagemInicial();
    }
    const btn = document.getElementById('sendButton');
    if (btn) {
        btn.addEventListener('click', async () => {
            const input = document.getElementById('userInput');
            const mensagem = input.value.trim();
            if (mensagem) {
                await enviarMensagemAPI(mensagem);
                input.value = '';
            }
        });
    }
}
document.addEventListener('DOMContentLoaded', inicializarChat);
