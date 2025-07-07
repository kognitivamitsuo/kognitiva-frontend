
// mainPage.js – Kognitiva v3.6 corrigido
(function() {
    'use strict';

    // 1. 🔄 Mantém todas as funções existentes exatamente como estão
    window.initChat = window.initChat || function() {
        console.log('[Kognitiva] Chat inicializado');
        renderMensagemInicial();
        setupEventHandlers();
    };

    window.carregarContexto = window.carregarContexto || function() {
        return JSON.parse(localStorage.getItem('contexto') || '{}');
    };

    window.atualizarListaClientes = window.atualizarListaClientes || function(nome) {
        console.log(`Atualizando lista com cliente: ${nome}`);
    };

    window.selecionarCliente = window.selecionarCliente || function(nome) {
        console.log(`Cliente selecionado: ${nome}`);
    };

    window.renderMensagemIA = window.renderMensagemIA || function(data) {
        console.log('Mensagem IA:', data);
    };

    window.fallbackBasico = window.fallbackBasico || function() {
        console.warn('Modo básico ativado');
    };

    // 2. ✅ Correções adicionais (sem sobrescrever lógicas existentes)

    // ➕ renderMensagemUsuario() (⚠️ Obrigatória se usada)
    window.renderMensagemUsuario = window.renderMensagemUsuario || function(texto) {
        const chat = document.getElementById('chatMessages');
        if (!chat) return;

        const div = document.createElement('div');
        div.className = 'kgn-message kgn-user';
        div.innerHTML = `
            <div class="kgn-message-content">${texto}</div>
            <div class="kgn-message-meta">
                <span class="kgn-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                <span class="kgn-ai-label">Você</span>
            </div>
        `;
        chat.appendChild(div);
        chat.scrollTop = chat.scrollHeight;
    };

    // ➕ Validação leve para formMensagem
    const form = document.getElementById('formMensagem');
    if (!form) {
        console.warn('Elemento formMensagem não encontrado');
    } else {
        form.onsubmit = function(e) {
            e.preventDefault();
            const input = document.getElementById('inputMensagem');
            const mensagem = input.value.trim();
            if (mensagem) {
                window.handleSubmitMessage({ preventDefault: () => {}, target: this });
                input.value = '';
            }
        };
    }

    // ➕ Validação leve para botaoResetar
    const resetBtn = document.getElementById('botaoResetar');
    if (!resetBtn) {
        console.warn('botaoResetar ausente no DOM');
    } else {
        resetBtn.onclick = window.resetChat || function() {
            if (confirm("Tem certeza que deseja reiniciar a conversa?")) {
                localStorage.removeItem('contexto');
                document.getElementById('chatMessages').innerHTML = '';
                renderMensagemInicial();
            }
        };
    }

    // Funções auxiliares internas (mantidas conforme original)
    function renderMensagemInicial() {
        const chat = document.getElementById('chatMessages');
        if (!chat) return;

        const msg = document.createElement('div');
        msg.className = 'kgn-system-message';
        msg.innerHTML = '👋 Olá! Como posso te ajudar hoje?';
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    }

    function setupEventHandlers() {
        // Handlers já configurados acima para form e reset
    }

    // Auto-inicialização se elementos estiverem prontos
    if (document.readyState === 'complete') {
        window.initChat();
    } else {
        window.addEventListener('DOMContentLoaded', window.initChat);
    }

})();

