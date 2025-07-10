// diagnostico.js

function exibirDiagnostico(score) {
  const div = document.getElementById("diagnostico");
  if (!div) return;

  let texto = "📊 Diagnóstico da resposta: ";
  if (score >= 9) texto += "Excelente";
  else if (score >= 7) texto += "Boa";
  else if (score >= 5) texto += "Regular";
  else texto += "Precisa melhorar";

  div.innerText = texto;
  div.style.display = "block";
}
