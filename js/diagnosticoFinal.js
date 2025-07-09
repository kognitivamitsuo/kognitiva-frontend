function mostrarDiagnostico(diagnosticoData) {
  try {
    const diagnosticoElement = document.getElementById('diagnostico');
    if (diagnosticoElement) {
      diagnosticoElement.textContent = diagnosticoData.mensagem;
      diagnosticoElement.style.backgroundColor = diagnosticoData.cor;
      diagnosticoElement.style.display = 'block';
    }
  } catch (error) {
    console.error('Erro ao mostrar diagnóstico:', error);
  }
}
