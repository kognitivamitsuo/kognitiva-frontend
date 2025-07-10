function exibirDiagnostico(score) {
    const diag = document.getElementById('diagnostico');
    let status = score >= 8 ? 'Excelente' : score >= 5 ? 'Bom' : 'Melhorar';
    diag.innerHTML = `Diagnóstico da IA: <strong>${status}</strong> (Score: ${score}/10)`;
    diag.style.display = 'block';
}
