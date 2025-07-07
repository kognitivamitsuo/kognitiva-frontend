// utils/execControl.js
// Controle unificado de execução da IA – compatível com navegador puro (sem export)

window.executarIA = async function(mensagem, contexto = {}) {
  const payload = {
    mensagem_usuario: mensagem,
    contexto: contexto,
    modo_execucao: 'execucao',
    framework_version: '3.4-finalUX'
  };

  const token = localStorage.getItem('kgn_jwt');
  const headers = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
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


