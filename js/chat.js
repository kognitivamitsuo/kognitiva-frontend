// Função para criptografar o token antes de armazená-lo (opcional para maior segurança)
function criptografar(dado) {
    return btoa(dado);  // Exemplo simples de criptografia (Base64), use criptografia real para produção
}

// Função para descriptografar o token ao recuperá-lo
function descriptografar(dado) {
    return atob(dado);  // Exemplo simples de descriptografia (Base64)
}

// Função para armazenar o token JWT no localStorage (com criptografia opcional)
function armazenarToken(token) {
    if (token) {
        const encryptedToken = criptografar(token);  // Criptografa o token
        localStorage.setItem('jwt_token', encryptedToken);  // Armazenar no localStorage
        console.log('Token armazenado no localStorage com sucesso');
    } else {
        console.error('Erro: O token não pode ser armazenado, pois é inválido.');
    }
}

// Função para recuperar o token JWT do localStorage (com descriptografia)
function recuperarToken() {
    const encryptedToken = localStorage.getItem('jwt_token');
    if (!encryptedToken) {
        console.error('Token não encontrado no localStorage');
        return null;
    }
    return descriptografar(encryptedToken);  // Descriptografa o token
}

// Função para fazer login (exemplo simples)
function login(username, password) {
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Falha no login: Erro ao autenticar');
        }
        return response.json();
    })
    .then(data => {
        if (data.token) {
            armazenarToken(data.token);  // Armazenando no localStorage
            console.log('Login bem-sucedido!');
            window.location.href = "/chat";  // Redireciona para a página do chat
        } else {
            console.error('Falha no login: Token não recebido');
            alert('Falha no login: Token não recebido');
        }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao tentar fazer login. Tente novamente.');
    });
}

// Função para fazer uma requisição autenticada
function fazerRequisicaoAutenticada(url, metodo = 'GET', dados = {}) {
    const token = recuperarToken();
    if (!token) {
        console.error('Token não encontrado. Usuário não autenticado.');
        return;
    }

    fetch(url, {
        method: metodo,
        headers: {
            'Authorization': `Bearer ${token}`,  // Envia o token no cabeçalho
            'Content-Type': 'application/json'
        },
        body: metodo === 'POST' ? JSON.stringify(dados) : undefined
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Dados recebidos:', data);
    })
    .catch(error => {
        console.error('Erro ao fazer requisição autenticada:', error);
    });
}

// Função para verificar se o token JWT é válido
async function verificarToken() {
    const token = recuperarToken();

    if (!token) {
        console.log('Token não encontrado, usuário não autenticado');
        return false;
    }

    try {
        const response = await fetch('/verify-token', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log('Token válido!');
            return true;
        } else {
            console.log('Token inválido!');
            return false;
        }
    } catch (error) {
        console.error('Erro ao verificar o token:', error);
        return false;  // Caso haja erro na requisição
    }
}

// Função para fazer logout (remover o token)
function logout() {
    localStorage.removeItem('jwt_token');  // Remove o token do localStorage
    console.log('Usuário desconectado');
    window.location.href = "/login";  // Redireciona para a página de login
}

// Função adicional para verificar a sessão (quando o usuário já está logado)
function verificarSessao() {
    const token = recuperarToken();
    if (!token) {
        console.log('Usuário não está logado.');
        window.location.href = "/login";  // Redireciona para a página de login se o token não existir
    }
}

// Função para verificar se o token JWT ainda é válido antes de permitir interações no chat
function verificarSessaoAtiva() {
    const token = recuperarToken();
    if (!token) {
        console.log('Sessão expirada ou token não encontrado. Redirecionando para login...');
        window.location.href = "/login";  // Redireciona para login se o token não estiver presente
    } else {
        // Verifica se o token ainda é válido no backend
        verificarToken().then(isValid => {
            if (!isValid) {
                console.log('Token inválido, redirecionando para login...');
                window.location.href = "/login";  // Redireciona para login caso o token seja inválido
            }
        });
    }
}

// Função para renderizar a mensagem inicial após a verificação do token
function renderMensagemInicial() {
    const mensagemInicial = "Olá! Como posso ajudar você hoje?";
    const messagesContainer = document.getElementById("messages");

    const messageElement = document.createElement("div");
    messageElement.classList.add("message", "system");
    messageElement.textContent = mensagemInicial;

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Chamada inicial para verificar a autenticação e renderizar a mensagem
document.addEventListener('DOMContentLoaded', () => {
    if (!verificarSessaoAtiva()) return;  // Verifica a autenticação

    renderMensagemInicial();  // Renderiza a mensagem inicial
});
