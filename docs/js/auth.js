import DOMPurify from 'dompurify'; // ✅ Sanitização XSS

async function enviarMensagemAPI(mensagem) {
  // Validação
  if (!mensagem?.trim() || mensagem.length > 500) {
    showToast("Mensagem inválida (máx. 500 caracteres)", "error");
    return;
  }

  try {
    const controller = new AbortController();
    const TIMEOUT = process.env.TIMEOUT_API || 10000; // Timeout configurável
    setTimeout(() => controller.abort(), TIMEOUT); // Timeout de 10s

    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/proxy/execucao`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem }),
      credentials: 'include',
      signal: controller.signal
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erro na comunicação com a API");
    }

    const contentType = response.headers.get("Content-Type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      exibirRespostaIA(DOMPurify.sanitize(data.resposta)); // ✅ Anti-XSS
    } else {
      throw new Error("Resposta inválida, esperada JSON");
    }

  } catch (err) {
    showToast(err.message || "Erro na API", "error");
  }
}

// Exemplo de logout (remove cookie)
function logout() {
  document.cookie = "jwt_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT; Secure; SameSite=Strict";
  // Se os tokens forem armazenados em outro lugar, também os remova
  localStorage.removeItem('jwt_token');
  sessionStorage.removeItem('jwt_token');
}
