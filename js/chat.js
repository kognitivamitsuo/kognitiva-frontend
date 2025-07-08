// Função para armazenar o token JWT no localStorage
function armazenarToken(token) {
    localStorage.setItem('jwt_token', token);  // Armazenar no localStorage
}

// Função para recuperar o token JWT do localStorage
function recuperarToken() {
    return localStorage.getItem('jwt_token');  // Recupera o token do localStorage
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
            // Redireciona ou realiza outra ação, como abrir o chat
        } else {
            console.error('Falha no login');
        }
    })
    .catch(error => {
        console.error('Erro ao fazer login:', error);
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
    .then(response => response.json())
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

    // Caso deseje verificar a validade do token, pode ser necessário fazer uma requisição ao backend.
    // Aqui estamos assumindo que o backend valida o token para nós. Por exemplo, podemos ter uma rota /verify-token.
    fetch('/verify-token', {
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
    .catch(error => console.error('Erro ao verificar o token:', error));

    return true;  // Retorno temporário, para otimizar o fluxo.
}

// Função para fazer logout (remover o token)
function logout() {
    localStorage.removeItem('jwt_token');  // Remove o token do localStorage
    console.log('Usuário desconectado');
}

