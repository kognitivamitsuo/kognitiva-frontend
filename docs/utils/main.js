// mainPage.js – Kognitiva v3.6 corrigido
(function() {
    'use strict';

    // 1. ✅ initChat()
    window.initChat = function() {
        try {
            console.log('[Kognitiva] Inicializando chat v3.6');
            
            // Verifica elementos essenciais
            if (!document.getElementById('chatMessages')) {
                console.warn('Elemento chatMessages não encontrado');
                return;
            }

            // Carrega contexto existente
            const contexto = carregarContexto();
            
            // Ativa LGPD se consentido
            if (contexto.lgpd_consentido) {
                document.getElementById('lgpdBanner').style.display = 'none';
            }

            // Renderiza mensagens anteriores se existirem
            if (contexto.conversa && contexto.conversa.length > 0) {
                contexto.conversa.forEach(msg => {
                    if (msg.origem === 'usuario') {
                        window.renderMensagemUsuario(msg.conteudo);
                    } else {
                        window.renderMensagemIA(msg);
                    }
                });
            } else {
                renderMensagemInicial();
            }

            // Mostra aviso de reaproveitamento se aplicável
            if (contexto.cliente_nome) {
                renderAvisoReaproveitamento(contexto.cliente_nome);
            }

            // Atualiza lista de clientes
            if (contexto.cliente_nome) {
                atualizarListaClientes(contexto.cliente_nome);
            }

            // Configura handlers
            setupEventHandlers();

        } catch (error) {
            console.error('[Kognitiva] Erro na inicialização:', error);
            fallbackBasico();
        }
    };

    // 2. ✅ carregarContexto()
    window.carregarContexto = function() {
        const contextoPadrao = {
            cliente_nome: '',
            conversa: [],
            superprompt: '',
            lgpd_consentido: false,
            diagnosticos: []
        };

        try {
            const contextoSalvo = localStorage.getItem('contexto');
            if (!contextoSalvo) return contextoPadrao;

            const contexto = JSON.parse(contextoSalvo);
            
            // Validação do contexto
            if (!contexto.cliente_nome || !contexto.conversa) {
                console.warn('Contexto incompleto detectado');
                return {...contextoPadrao, ...contexto};
            }

            return contexto;
        } catch (error) {
            console.warn('Erro ao carregar contexto, usando padrão');
            return contextoPadrao;
        }
    };

    // 3. ✅ atualizarListaClientes(nome)
    window.atualizarListaClientes = function(nome) {
        if (!nome) return;

        try {
            const listaClientes = document.getElementById('listaClientes');
            if (!listaClientes) return;

            // Verifica se cliente já existe
            const clienteExistente = Array.from(listaClientes.children)
                .find(item => item.textContent.trim() === nome);

            if (!clienteExistente) {
                const novoItem = document.createElement('li');
                novoItem.textContent = nome;
                novoItem.onclick = () => selecionarCliente(nome);
                listaClientes.appendChild(novoItem);
                
                // Ordena lista alfabeticamente
                const itensOrdenados = Array.from(listaClientes.children)
                    .sort((a, b) => a.textContent.localeCompare(b.textContent));
                
                listaClientes.innerHTML = '';
                itensOrdenados.forEach(item => listaClientes.appendChild(item));
            }
        } catch (error) {
            console.warn('Erro ao atualizar lista de clientes:', error);
        }
    };

    // 4. ✅ selecionarCliente(nome)
    window.selecionarCliente = function(nome) {
        try {
            const contexto = carregarContexto();
            if (contexto.cliente_nome === nome) return;

            // Atualiza contexto
            const novoContexto = {
                ...contexto,
                cliente_nome: nome,
                superprompt: contexto.superprompt || gerarSuperpromptPadrao(nome)
            };

            localStorage.setItem('contexto', JSON.stringify(novoContexto));
            
            // Reinicia chat com novo contexto
            document.getElementById('chatMessages').innerHTML = '';
            initChat();
            
            // Feedback visual
            document.querySelectorAll('#listaClientes li').forEach(item => {
                item.classList.toggle('ativo', item.textContent.trim() === nome);
            });

        } catch (error) {
            console.error('Erro ao selecionar cliente:', error);
        }
    };

    // 5. ✅ renderMensagemIA(data) (com fallback)
    window.renderMensagemIA = window.renderMensagemIA || function(data) {
        try {
            const now = new Date();
            const chat = document.getElementById('chatMessages');
            if (!chat) return;

            const messageDiv = document.createElement('div');
            messageDiv.className = 'kgn-message kgn-ai';
            messageDiv.innerHTML = `
                <div class="kgn-message-content">${data.conteudo || data}</div>
                <div class="kgn-message-meta">
                    <span class="kgn-time">${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    <span class="kgn-ai-label">Assistente</span>
                </div>
                <div class="feedback-box">
                    <button class="feedback-btn" data-score="positivo">👍</button>
                    <button class="feedback-btn" data-score="negativo">👎</button>
                </div>
            `;

            chat.appendChild(messageDiv);
            chat.scrollTop = chat.scrollHeight;

            // Atualiza diagnóstico se necessário
            if (data.diagnostico_final) {
                const diagnosticoElement = document.getElementById('diagnosticoFinal');
                if (diagnosticoElement) {
                    diagnosticoElement.style.display = 'block';
                }
            }

            // Atualiza contexto da conversa
            const contexto = carregarContexto();
            contexto.conversa = contexto.conversa || [];
            contexto.conversa.push({
                origem: 'ia',
                conteudo: data.conteudo || data,
                timestamp: new Date().toISOString()
            });
            localStorage.setItem('contexto', JSON.stringify(contexto));

        } catch (error) {
            console.error('Erro ao renderizar mensagem IA:', error);
            fallbackBasico();
        }
    };

    // Funções auxiliares internas
    function renderMensagemInicial() {
        const chat = document.getElementById('chatMessages');
        if (!chat) return;

        const msg = document.createElement('div');
        msg.className = 'kgn-system-message';
        msg.innerHTML = '👋 Olá! Como posso te ajudar hoje?';
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    }

    function renderAvisoReaproveitamento(nomeCliente) {
        const chat = document.getElementById('chatMessages');
        if (!chat) return;

        const msg = document.createElement('div');
        msg.className = 'kgn-system-message';
        msg.innerHTML = `💡 Reaproveitando contexto anterior com ${nomeCliente}`;
        chat.appendChild(msg);
        chat.scrollTop = chat.scrollHeight;
    }

    function setupEventHandlers() {
        // Handler existente para formulário
        const form = document.getElementById('formMensagem');
        if (form) {
            form.onsubmit = function(e) {
                e.preventDefault();
                const input = document.getElementById('inputMensagem');
                const mensagem = input.value.trim();
                if (mensagem) {
                    window.handleSubmitMessage({ preventDefault: () => {}, target: form });
                    input.value = '';
                }
            };
        }

        // Handler para botão de reset
        const resetBtn = document.getElementById('botaoResetar');
        if (resetBtn) {
            resetBtn.onclick = window.resetChat || function() {
                if (confirm("Tem certeza que deseja reiniciar a conversa?")) {
                    localStorage.removeItem('contexto');
                    document.getElementById('chatMessages').innerHTML = '';
                    renderMensagemInicial();
                }
            };
        }
    }

    function fallbackBasico() {
        console.warn('Ativando modo básico do chat');
        const chat = document.getElementById('chatMessages');
        if (chat) {
            chat.innerHTML = '<div class="kgn-system-message">⚠️ Modo básico ativado. Recarregue a página para tentar novamente.</div>';
        }
    }

    function gerarSuperpromptPadrao(nome) {
        return `O cliente ${nome} está buscando atendimento personalizado.`;
    }

    // Auto-inicialização se elementos estiverem prontos
    if (document.readyState === 'complete') {
        window.initChat();
    } else {
        window.addEventListener('DOMContentLoaded', window.initChat);
    }

})();
