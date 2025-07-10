// auth.js

// ✅ Corrigido: BACKEND_URL agora definido globalmente via window.BACKEND_URL
// Utilize window.BACKEND_URL em todo o código

// Verifica se há um token JWT válido no localStorage
function verificarTokenJWT() {
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    console.warn("⚠️ Token JWT não encontrado. Tentando obter do backend...");
    return obterTokenDoBackend(); // Tenta obter automaticamente
  }
  console.log("✅ Token JWT encontrado e válido.");
  return true;
}

// Tenta obter o token do backend (via /proxy/token)
async function obterTokenDoBackend() {
  try {
    const response = await fetch(`${window.BACKEND_URL}/proxy/token`);
    const data = await response.json();

    if (data && data.token) {
      localStorage.setItem("jwt_token", data.token);
      console.log("✅ Token JWT obtido e salvo.");
      return true;
    } else {
      alert("⚠️ Token não recebido. Acesse via ambiente com login.");
      return false;
    }
  } catch (error) {
    console.error("Erro ao obter token:", error);
    alert("❌ Erro ao tentar autenticar com o servidor.");
    return false;
  }
}

