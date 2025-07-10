// contextService.js

// ✅ Armazena o contexto no localStorage com chave fixa
// ✅ Compatível com o backend via window.BACKEND_URL

const CONTEXTO_KEY = "contexto_kognitiva";

// Salva o contexto localmente
function salvarContexto(contexto) {
  localStorage.setItem(CONTEXTO_KEY, JSON.stringify(contexto));
  console.log("🧠 Contexto salvo.");
}

// Recupera o contexto local
function obterContexto() {
  const raw = localStorage.getItem(CONTEXTO_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.warn("⚠️ Falha ao recuperar contexto.");
    return null;
  }
}

// Envia contexto para o backend
async function enviarContextoParaBackend(contexto) {
  const token = localStorage.getItem("jwt_token");
  try {
    const response = await fetch(`${window.BACKEND_URL}/proxy/contexto`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contexto),
    });
    console.log("🧠 Contexto enviado ao backend.");
    return await response.json();
  } catch (error) {
    console.error("Erro ao enviar contexto:", error);
    return null;
  }
}

// Recupera contexto persistente do backend
async function carregarContextoDoBackend() {
  const token = localStorage.getItem("jwt_token");
  try {
    const response = await fetch(`${window.BACKEND_URL}/proxy/contexto`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const contexto = await response.json();
    salvarContexto(contexto);
    return contexto;
  } catch (error) {
    console.error("Erro ao carregar contexto do backend:", error);
    return null;
  }
}
