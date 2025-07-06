
// Serviço de contexto (B13)
export function salvarContexto(nome, dados) {
  if (!nome || !dados) return;
  const contexto = JSON.stringify(dados);
  localStorage.setItem(`kognitiva_contexto_${nome}`, contexto);
}

export function obterContexto(nome) {
  if (!nome) return null;
  const raw = localStorage.getItem(`kognitiva_contexto_${nome}`);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Erro ao carregar contexto:', e);
    return null;
  }
}

export function atualizarListaClientes(nome) {
  const lista = document.getElementById('sidebarClientes');
  if (!lista) return;

  const existente = [...lista.querySelectorAll('li')].find(li => li.textContent === nome);
  if (!existente) {
    const li = document.createElement('li');
    li.textContent = nome;
    li.onclick = () => carregarCliente(nome);
    lista.appendChild(li);
  }
}

export function carregarCliente(nome) {
  const contexto = obterContexto(nome);
  if (contexto && contexto.mensagens) {
    const chat = document.getElementById('chatMessages');
    chat.innerHTML = '';
    contexto.mensagens.forEach(m => {
      const div = document.createElement('div');
      div.className = `message ${m.tipo}`;
      div.textContent = m.texto;
      chat.appendChild(div);
    });
  }
}
