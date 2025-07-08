const axios = require('axios');

async function enviarIA(mensagem) {
    const response = await axios.post('/api/consulta', {
        mensagem: mensagem,
        contexto: obterContexto()
    });
    mostrarResposta(response.data.resposta);
}

function obterContexto() {
    // Função para coletar o contexto da sessão atual
    return {
        cliente_nome: 'Cliente X',
        produto_interesse: 'Produto Y',
        etapa_funil: 'qualificação'
    };
}

function mostrarResposta(resposta) {
    const mensagens = document.getElementById("messages");
    const mensagemResposta = document.createElement("div");
    mensagemResposta.textContent = resposta;
    mensagens.appendChild(mensagemResposta);
}

