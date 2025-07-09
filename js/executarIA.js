async function enviarIA(mensagem) {
  if (!verificarAutenticacao()) return;

  try {
    const token = localStorage.getItem('jwt_token');
    const response = await fetch('/api/consulta', {
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

    if (!response.ok) throw new Error('Erro na resposta da API');

    const data = await response.json();
    adicionarMensagem(data.resposta, 'ia');
    
    if (typeof mostrarDiagnostico === 'function') {
      mostrarDiagnostico(data.diagnostico);
    }
    
    if (typeof coletarFeedback === 'function') {
      coletarFeedback();
    }
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
    adicionarMensagem("⚠️ Ocorreu um erro ao processar sua mensagem. Tente novamente.", 'system');
  }
}

function obterContexto() {
  return {
    cliente_nome: 'Cliente',
    produto_interesse: 'Produto',
    etapa_funil: 'inicio'
  };
}

