// main.js

// Variáveis globais para controle da sessão
let currentClient = null;
let sessionId = null;
let token = localStorage.getItem('jwt_token');  // Token JWT armazenado no localStorage

// Função para carregar a lista de clientes e exibi-los na barra lateral
async function loadClients() {
  const clientListContainer = document.getElementById('client-list');

  try {
    const response = await fetch('/api/clients', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const clients = await response.json();

    if (response.ok) {
      clients.forEach(client => {
        const clientElement = document.createElement('li');
        clientElement.textContent = client.name;
        clientElement.addEventListener('click', () => startNewSession(client.id)); // Inicia uma nova sessão ao clicar
        clientListContainer.appendChild(clientElement);
      });
    } else {
      console.error('Erro ao carregar clientes:', clients);
    }
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
  }
}

// Função para iniciar uma nova sessão com o cliente
async function startNewSession(clientId) {
  currentClient = clientId;  // Define o cliente selecionado
  sessionId = generateUUID();  // Gera um novo UUID para a sessão

  // Solicita o contexto do cliente e inicia o chat
  await getClientContext(currentClient);
  sendMessage('Olá, como posso ajudar você hoje?', true);  // Mensagem inicial da IA
}

// Função para obter o contexto do cliente
async function getClientContext(clientId) {
  try {
    const response = await fetch(`/api/context?cliente_id=${clientId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const result = await response.json();
    if (response.ok) {
      console.log('Contexto recuperado:', result);
    } else {
      console.error('Erro ao recuperar contexto:', result);
    }
  } catch (error) {
    console.error('Erro na requisição do contexto:', error);
  }
}

// Função para enviar uma mensagem para o chat
async function sendMessage(message, fromAI = false) {
  const messagesContainer = document.getElementById('messages-container');

  // Cria o elemento da mensagem
  const messageElement = document.createElement('div');
  messageElement.classList.add(fromAI ? 'ai-message' : 'user-message');
  messageElement.innerHTML = `<p>${message}</p>`;

  messagesContainer.appendChild(messageElement);

  // Rola para a última mensagem
  messagesContainer.scrollTop = messagesContainer.scrollHeight;

  if (!fromAI) {
    // Envia a mensagem para o backend (se for do usuário)
    await sendMessageToServer(message);
  }
}

// Função para enviar a mensagem do usuário para o backend
async function sendMessageToServer(message) {
  try {
    const response = await fetch('/api/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        prompt: message,
        context: {
          cliente_nome: currentClient, // Recupera o nome do cliente
        },
      }),
    });

    const result = await response.json();

    if (response.ok) {
      // Exibe a resposta da IA
      const aiResponse = result.data;
      sendMessage(aiResponse, true);
      handleFeedbackButtons();  // Exibe os botões de feedback
    } else {
      sendMessage("Ocorreu um erro ao processar sua solicitação. Tente novamente.", true);
    }
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
    sendMessage("Ocorreu um erro na comunicação com o servidor.", true);
  }
}

// Função para lidar com o feedback do usuário
function handleFeedbackButtons() {
  const thumbsUpButton = document.getElementById('thumbs-up');
  const thumbsDownButton = document.getElementById('thumbs-down');

  thumbsUpButton.addEventListener('click', () => submitFeedback('positivo'));
  thumbsDownButton.addEventListener('click', () => submitFeedback('negativo'));
}

// Função para enviar o feedback do usuário
async function submitFeedback(feedbackType) {
  try {
    const response = await fetch('/proxy/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        feedback: feedbackType,  // 'positivo' ou 'negativo'
        timestamp: new Date().toISOString(),
      }),
    });

    const result = await response.json();
    if (result.success) {
      alert('Obrigado pelo seu feedback!');
    } else {
      alert('Erro ao enviar feedback. Tente novamente.');
    }
  } catch (error) {
    console.error('Erro ao enviar feedback:', error);
    alert('Falha na comunicação com o servidor.');
  }
}

// Função para gerar um UUID (identificador único para a sessão)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Função para resetar o chat
function resetChat() {
  const messagesContainer = document.getElementById('messages-container');
  messagesContainer.innerHTML = '';  // Limpa as mensagens

  // Pode adicionar lógica para resetar o contexto ou sessão se necessário
}

// Função para inicializar a aplicação
function initializeChat() {
  loadClients();  // Carrega a lista de clientes

  const resetButton = document.getElementById('reset-button');
  resetButton.addEventListener('click', resetChat);

  const endSessionCommand = '/encerrar';
  document.getElementById('user-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      const inputText = event.target.value;
      if (inputText === endSessionCommand) {
        resetChat();
        event.target.value = '';  // Limpa o campo de entrada
        sendMessage('A sessão foi encerrada. Como posso ajudar em outro momento?', true);
      }
    }
  });
}

// Inicializa o chat
initializeChat();
