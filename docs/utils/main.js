// Função para chamar a API Kognitiva (mantida integralmente)
const callKognitivaAPI = async (mensagem) => {
  const contexto = JSON.parse(localStorage.getItem('contexto') || '{}');
  const resultado = await executarIA(mensagem, contexto);
  return {
    conteudo: resultado.resposta,
    score: resultado.score,
    contexto: contexto
  };
};

// Função para mesclar contextos (mantida integralmente)
function mergeContexto(novoContexto) {
    const contextoAtual = JSON.parse(localStorage.getItem('contexto') || '{}');
    const contextoMesclado = {...contextoAtual, ...novoContexto};
    localStorage.setItem('contexto', JSON.stringify(contextoMesclado));
    return contextoMesclado;
}

// NOVA FUNÇÃO: Renderização da mensagem inicial (B00)
function renderMensagemInicial() {
    const chat = document.getElementById('chatMessages');
    if (!chat) return;
    
    const msg = document.createElement('div');
    msg.className = 'kgn-system-message';
    msg.innerHTML = '👋 Olá! Me diga como posso te ajudar hoje.';
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
}

// NOVA FUNÇÃO: Aviso de reaproveitamento de contexto (B13)
function renderAvisoReaproveitamento() {
    const chat = document.getElementById('chatMessages');
    if (!chat) return;
    
    const contexto = JSON.parse(localStorage.getItem('contexto') || '{}'); // Corrigido erro de sintaxe
    if (contexto.cliente_nome) {
        const msg = document.createElement('div');
        msg.className = 'kgn-system-message';
        msg.innerHTML = `💡 Reaproveitando contexto anterior com ${contexto.cliente_nome}`;
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    }
}

// Função principal de inicialização (atualizada)
function initChat() {
    console.log('Chat Kognitiva v3.6 inicializado');
    renderMensagemInicial();          // Nova chamada (B00)
    renderAvisoReaproveitamento();   // Nova chamada (B13)
    setupEventHandlers();            // Mantido conforme original
}

// ============== TUDO ABAIXO MANTIDO EXATAMENTE COMO ORIGINAL ============== //

function setupEventHandlers() {
    const form = document.getElementById('formMensagem');
    if (form) form.addEventListener('submit', handleSubmitMessage);
    
    const resetBtn = document.getElementById('botaoResetar');
    if (resetBtn) resetBtn.addEventListener('click', resetChat);
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('feedback-btn')) {
            handleFeedback(e);
        }
    });
}

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

function resetChat() {
    if (confirm("Tem certeza que deseja reiniciar a conversa?")) {
        document.getElementById('chatMessages').innerHTML = '';
        localStorage.removeItem('contexto');
        renderMensagemInicial(); // Mostra novamente a mensagem inicial após reset
    }
}

function generateMessageId() {
    return 'msg-' + (window.crypto?.randomUUID ? crypto.randomUUID() : 
           Date.now() + '-' + document.getElementById('tokenSessao').value);
}

window.renderMensagemUsuario = function(mensagem, messageId) {
    const now = new Date();
    const chat = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'kgn-message kgn-user';
    messageDiv.id = messageId || generateMessageId();
    messageDiv.innerHTML = `
        <div class="kgn-message-content">${mensagem}</div>
        <div class="kgn-message-meta">
            <span class="kgn-time">${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <span class="kgn-user-label">Você</span>
        </div>
    `;
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;
};

window.renderMensagemIA = function(resposta) {
    const now = new Date();
    const chat = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    const messageId = resposta.id || generateMessageId();
    
    messageDiv.className = 'kgn-message kgn-ai';
    messageDiv.id = messageId;
    messageDiv.innerHTML = `
        <div class="kgn-message-content">${resposta.conteudo || resposta}</div>
        <div class="kgn-message-meta">
            <span class="kgn-time">${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
            <span class="kgn-ai-label">Assistente</span>
        </div>
        <div class="feedback-box" data-framework-block="B17">
            <button class="feedback-btn" data-event="feedback" data-score="positivo" data-message-id="${messageId}">👍</button>
            <button class="feedback-btn" data-event="feedback" data-score="negativo" data-message-id="${messageId}">👎</button>
        </div>
    `;
    
    if (resposta.score !== undefined) messageDiv.dataset.score = resposta.score;
    chat.appendChild(messageDiv);
    chat.scrollTop = chat.scrollHeight;

    if (resposta.score !== undefined && resposta.score < 6) {
        const diagnostico = document.getElementById('diagnosticoFinal');
        const conteudo = document.getElementById('diagnosticoConteudo');
        conteudo.innerHTML = resposta.diagnostico || `
            <p>Interação abaixo do ideal (score < 6).</p>
            <ul>
                <li>Considere reformular sua pergunta</li>
                <li>Verifique se forneceu todos os detalhes necessários</li>
                <li>Tente ser mais específico</li>
            </ul>
        `;
        diagnostico.style.display = 'block';
    }
};

document.addEventListener('DOMContentLoaded', initChat);
