// Função para mesclar contextos
function mergeContexto(novoContexto) {
    const contextoAtual = JSON.parse(localStorage.getItem('contexto') || '{}');
    const contextoMesclado = {...contextoAtual, ...novoContexto};
    localStorage.setItem('contexto', JSON.stringify(contextoMesclado));
    return contextoMesclado;
}

// Atualização no handleSubmitMessage
async function handleSubmitMessage(e) {
    e.preventDefault();
    const input = document.getElementById('inputMensagem');
    const mensagem = input.value.trim();
    if (!mensagem) return;

    const messageId = generateMessageId();
    renderMensagemUsuario(mensagem, messageId);
    
    try {
        const resposta = await callKognitivaAPI(mensagem);
        const respostaComId = {...resposta, id: generateMessageId()};
        renderMensagemIA(respostaComId);
        
        if (resposta.contexto) {
            mergeContexto(resposta.contexto);
        }
    } catch (error) {
        renderMensagemIA({
            conteudo: "Desculpe, estou com dificuldades técnicas. Tente novamente mais tarde.",
            score: 0,
            id: generateMessageId()
        });
    }

    input.value = '';
}

// Atualização nas funções de renderização
window.renderMensagemIA = function(resposta) {
    const now = new Date();
    const chat = document.getElementById("chatMessages");
    const messageDiv = document.createElement("div");
    
    messageDiv.className = "kgn-message kgn-ai";
    messageDiv.id = resposta.id || generateMessageId();
    messageDiv.innerHTML = `
        <div class="kgn-message-content">${resposta.conteudo || resposta}</div>
        <div class="kgn-message-meta">
            <span class="kgn-time">${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <span class="kgn-ai-label">Assistente</span>
        </div>
        <div class="feedback-box" data-framework-block="B17">
            <button class="feedback-btn" data-event="feedback" data-score="positivo" data-message-id="${messageDiv.id}">👍</button>
            <button class="feedback-btn" data-event="feedback" data-score="negativo" data-message-id="${messageDiv.id}">👎</button>
        </div>
    `;
    
    // Adicionar data-score se disponível na resposta
    if (resposta.score !== undefined) {
        messageDiv.dataset.score = resposta.score;
    }

    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;

    if (resposta.score !== undefined && resposta.score < 6) {
        ativarDiagnostico(resposta.diagnostico);
    }
};

function ativarDiagnostico(mensagem) {
    const diagnostico = document.getElementById('diagnosticoFinal');
    const conteudo = document.getElementById('diagnosticoConteudo');
    
    conteudo.innerHTML = mensagem || `
        <p>Interação abaixo do ideal (score < 6).</p>
        <ul>
            <li>Considere reformular sua pergunta</li>
            <li>Verifique se forneceu todos os detalhes necessários</li>
            <li>Tente ser mais específico</li>
        </ul>
    `;
    
    diagnostico.style.display = 'block';
}
