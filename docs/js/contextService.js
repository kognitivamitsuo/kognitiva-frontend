// contextService.js

const CONTEXTO_KEY = "contexto_kognitiva";

function salvarContexto(contexto) {
  localStorage.setItem(CONTEXTO_KEY, JSON.stringify(contexto));
  console.log("🧠 Contexto salvo.");
}

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
