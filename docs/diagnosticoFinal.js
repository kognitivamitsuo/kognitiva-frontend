
// diagnosticoFinal.js – Exibe avaliação da resposta da IA no final da conversa

function exibirDiagnosticoFinal(score, modelo) {
  let classificacao = "";
  if (score >= 85) {
    classificacao = "✅ ÓTIMO – resposta acima da média";
  } else if (score >= 60) {
    classificacao = "🟡 REVISAR – resposta aceitável, mas com margem de erro";
  } else {
    classificacao = "🔴 FALHA CRÍTICA – resposta inadequada ou incoerente";
  }

  const mensagem = `📊 Diagnóstico final:
Modelo: ${modelo}
Score: ${score}
Classificação: ${classificacao}`;

  adicionarMensagem("sistema", mensagem);
}

