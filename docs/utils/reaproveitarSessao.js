// utils/reaproveitarSessao.js
// ✅ Versão final compatível com navegador (sem export)
// 🔒 Compatível com Kognitiva v3.6

const URL_API = "https://sync.kognitiva.app";

// NOVA FUNÇÃO: Renderização do aviso de reaproveitamento (B13)
function renderAvisoReaproveitamento(cliente_nome) {
    if (!cliente_nome) return;
    
    const chat = document.getElementById("chatMessages");
    if (!chat) return;

    const aviso = document.createElement("div");
    aviso.className = "kgn-system-message";
    
    // Criação segura do conteúdo (sem innerHTML com input do usuário)
    const icone = document.createElement("span");
    icone.textContent = "💡 ";
    aviso.appendChild(icone);
    
    const texto = document.createElement("span");
    texto.textContent = `Reaproveitando contexto anterior com ${cliente_nome}`;
    aviso.appendChild(texto);
    
    chat.appendChild(aviso);
    chat.scrollTop = chat.scrollHeight;
}

window.verificarReaproveitamentoSessao = async function(tokenSessao, cliente_nome) {
    // Validação básica dos parâmetros
    if (!tokenSessao || !cliente_nome) {
        console.warn("[Kognitiva] Token ou nome do cliente não fornecido");
        return null;
    }

    try {
        const resposta = await fetch(`${URL_API}/proxy/cache_superprompt?cliente_nome=${encodeURIComponent(cliente_nome)}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${tokenSessao}`,
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            credentials: "same-origin"
        });

        if (!resposta.ok) {
            throw new Error(`HTTP error! status: ${resposta.status}`);
        }

        const dados = await resposta.json();
        
        if (dados?.superprompt) {
            console.log("[Kognitiva] Contexto reaproveitado para", cliente_nome);
            
            // Chamada da nova função para exibir aviso visual (B13)
            renderAvisoReaproveitamento(cliente_nome);
            
            return dados.superprompt;
        }

        console.log("[Kognitiva] Nenhum contexto anterior encontrado");
        return null;

    } catch (erro) {
        console.error("[Kognitiva] Erro ao verificar contexto:", erro);
        return null;
    }
};
