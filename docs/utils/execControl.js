// utils/execControl.js – Controle unificado de execução da IA
// Compatível com navegador puro (sem export) – v3.6 corrigido

window.executarIA = async function(mensagem, contexto = {}) {
  const payload = {
    mensagem_usuario: mensagem,
    contexto: contexto,
    modo_execucao: 'execucao',
    framework_version: '3.4-finalUX'
  };

  // Reforço: tenta obter token direto do campo hidden se não estiver no localStorage
  let token = localStorage.getItem('kgn_jwt');

  if (!token) {
    const tokenInput = document.getElementById('tokenSessao');
    if (tokenInput && tokenInput.value) {
      token = tokenInput.value;
      // Sincroniza com o localStorage para execuções futuras
      localStorage.setItem('kgn_jwt', token);
    }
  }

  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    // Atualiza o campo hidden visual para debug e fallback
    const tokenInputDOM = document.getElementById('tokenSessao');
    if (tokenInputDOM) {
      tokenInputDOM.value = token;
    }
  }

  try {
    const resposta = await fetch('https://sync.kognitiva.app/executar', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    if (!resposta.ok) {
      throw new Error(`Erro HTTP: ${resposta.status}`);
    }

    const json = await resposta.json();

    return {
      status: 'ok',
      resposta: json.resposta,
      modelo_utilizado: json.modelo_utilizado,
      score_resposta: json.score_resposta,
      fallback: json.fallback || false
    };

  } catch (erro) {
    console.error('[execControl] Fallback ativado:', erro);
    return {
      status: 'erro',
      resposta: '⚠️ Erro ao processar sua solicitação. Tente novamente mais tarde.',
      modelo_utilizado: 'fallback',
      score_resposta: 0,
      fallback: true
    };
  }
};



