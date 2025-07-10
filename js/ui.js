// Função mock para login (substitua pela API do Wix real)
const wixAuth = {
  login: async () => {
    // Simula login e retorno de token JWT
    return 'eyJhbGciOiJIUzI1NiIsInR...'; // token mock
  }
};

// Função para realizar login via Wix e armazenar o token JWT
async function loginWix() {
  try {
    const token = await wixAuth.login(); // Wix login
    localStorage.setItem('jwt_token', token);
    console.log("✅ Usuário autenticado com sucesso.");
    return token;
  } catch (error) {
    console.error('Erro no login com Wix:', error);
    alert('❌ Falha no login. Tente novamente.');
  }
}

// Verifica se há token JWT no localStorage e redireciona para login se não existir
function verificarTokenJWT() {
  const token = localStorage.getItem('jwt_token');
  if (!token) {
    const messagesContainer = document.getElementById('messages');
    if (messagesContainer) {
      const msg = document.createElement('div');
      msg.classList.add('message', 'system', 'erro');
      msg.textContent = "🔒 Você precisa estar autenticado para acessar o chat.";
      messagesContainer.appendChild(msg);
    }
    window.location.href = '/login';
    return false;
  }
  console.log('🛡 Token JWT encontrado.');
  return true;
}

// Função auxiliar utilizada nos demais scripts
function verificarAutenticacao() {
  return verificarTokenJWT();
}

// Armazenamento temporário no sessionStorage
function salvarDadosTemporarios(dados) {
  sessionStorage.setItem('dados_temp', JSON.stringify(dados));
  console.log('🧠 Dados temporários salvos no sessionStorage.');
}

// Recuperação dos dados temporários
function recuperarDadosTemporarios() {
  const dados = sessionStorage.getItem('dados_temp');
  return dados ? JSON.parse(dados) : null;
}

