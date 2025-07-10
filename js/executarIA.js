// Envia a mensagem do usuário para o backend e exibe a resposta da IA
async function enviarIA(mensagem) {
    if (!verificarAutenticacao()) return;

    try {
        const token = localStorage.getItem('jwt_token');
        const response = await fetch('/api/mensagem', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                mensagem: mensagem,
                contexto: obterContexto()
            })
        });

        if (!response.ok) {
            throw new Error('Erro ao enviar mensagem');
        }

        const data = await response.json();

        // Exibe a resposta da IA
        if (data.resposta) {
            adicionarMensagem(data.resposta, 'ia');
        }

        // Exibe diagnóstico, se houver
        if (data.diagnostico) {
            mostrarDiagnostico(data.diagnostico);
        }

        // Coleta feedback do usuário
        coletarFeedback();

    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        adicionarMensagem("⚠️ Ocorreu um erro ao processar sua mensagem. Tente novamente.", 'system');
    }
}

// Função para recuperar o contexto da conversa
function obterContexto() {
    const contexto = recuperarContextoDoLocalStorage();
    return contexto || {
        cliente_nome: 'Cliente',
        produto_interesse: 'Produto',
        etapa_funil: 'inicio'
    };
}

