const axios = require('axios');

// Função para enviar a mensagem à IA e processar a resposta
async function enviarIA(mensagem) {
    // Recupera o token JWT do localStorage
    const token = recuperarToken();  // Recupera o token JWT armazenado no localStorage

    // Verifica se o token não foi encontrado
    if (!token) {
        console.error('Token não encontrado, usuário não autenticado');
        return;
    }

    try {
        // Envia a requisição POST com o token JWT no cabeçalho
        const response = await axios.post('/api/consulta', {
            mensagem: mensagem,
            contexto: obterContexto(),  // Obtém o contexto da interação (pode ser de uma variável ou função externa)
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,  // Envia o token JWT no cabeçalho Authorization
                'Content-Type': 'application/json'   // Define o tipo de conteúdo como JSON
            }
        });

        // Exibe a resposta recebida da IA
        mostrarResposta(response.data.resposta);
    } catch (error) {
        // Caso ocorra erro na requisição
        console.error('Erro ao enviar mensagem para a IA:', error);
    }
}

// Função para obter o contexto da sessão do usuário (deve ser ajustada conforme a implementação do seu contexto)
function obterContexto() {
    // Exemplo de um contexto fixo, pode ser modificado para pegar o contexto de uma sessão ativa ou de um armazenamento
    return {
        cliente_nome: 'Cliente X',
        produto_interesse: 'Produto Y',
        etapa_funil: 'qualificação'
    };
}

// Função para exibir a resposta da IA no chat (adapte a exibição conforme sua implementação)
function mostrarResposta(resposta) {
    const mensagens = document.getElementById("messages");

    // Cria um novo elemento de mensagem e insere a resposta
    const mensagemResposta = document.createElement("div");
    mensagemResposta.textContent = resposta;

    // Adiciona a mensagem no contêiner de mensagens
    mensagens.appendChild(mensagemResposta);

    // Rola a tela para a última mensagem
    mensagens.scrollTop = mensagens.scrollHeight;
}
