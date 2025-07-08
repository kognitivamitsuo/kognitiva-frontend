// Função para armazenar o token JWT no localStorage
function armazenarToken(token) {
    localStorage.setItem('jwt_token', token);  // Armazenar no localStorage
    console.log('Token armazenado no localStorage');
}

// Função para recuperar o token JWT do localStorage
function recuperarToken() {
    const token = localStorage.getItem('jwt_token');
    if (!token) {
        console.error('Token não encontrado no localStorage');
    }
    return token;
}

// Função para fazer login (exemplo simples)
function login(username, password) {
    fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.token) {
            armazenarToken(data.token);  // Armazena o token no localStorage
            console.log('Login bem-sucedido!');
            window.location.href = "/chat";  // Redireciona para a página do chat
        } else {
            console.error('Falha no login: Token não recebido');
            alert('Falha no login');
        }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao tentar fazer login');
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
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: metodo === 'POST' ? JSON.stringify(dados) : undefined
    })
    .then(response => {
        if (!response.ok) {
            console.error('Erro na requisição:', response.statusText);
            throw new Error('Erro na requisição');
        }
        return response.json();
    })
    .then(data => console.log(data))
    .catch(error => console.error('Erro ao fazer requisição autenticada:', error));
}

// Função para verificar se o token JWT é válido
function verificarToken() {
    const token = recuperarToken();

    if (!token) {
        console.log('Token não encontrado, usuário não autenticado');
        return false;
    }

    return fetch('/verify-token', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            console.log('Token válido!');
            return true;
        } else {
            console.log('Token inválido!');
            return false;
        }
    })
    .catch(error => {
        console.error('Erro ao verificar o token:', error);
        return false;  // Caso haja erro na requisição
    });
}

// Função para fazer logout (remover o token)
function logout() {
    localStorage.removeItem('jwt_token');  // Remove o token do localStorage
    console.log('Usuário desconectado');
    window.location.href = "/login";  // Redireciona para a página de login
}
