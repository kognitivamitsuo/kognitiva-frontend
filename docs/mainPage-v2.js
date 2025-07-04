
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("inputMensagem");
  const botao = document.getElementById("botaoEnviar");
  const chat = document.getElementById("chatMessages");

  let tokenSessao = null;

  async function obterToken() {
    try {
      const resposta = await fetch("https://sync.kognitiva.app/proxy/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "visitante_web",
          ip: "000.000.000.000",
          user_agent: navigator.userAgent
        })
      });

      const dados = await resposta.json();
      if (resposta.ok && dados.tokenConfirmado) {
        tokenSessao = dados.token_sessao;
        console.log("🔐 Token obtido com sucesso.");
        await enviarContexto();
      } else {
        console.error("❌ Erro ao obter token:", dados);
      }
    } catch (erro) {
      console.error("❌ Erro na requisição do token:", erro);
    }
  }

  async function enviarContexto() {
    try {
      if (!tokenSessao) return;

      const contexto = {
        token_sessao: tokenSessao,
        empresa_usuario: "Oriente Marketing",
        perfil_usuario: "comercial",
        objetivo_interacao: "teste"
      };

      const resposta = await fetch("https://sync.kognitiva.app/proxy/contexto", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenSessao}`
        },
        body: JSON.stringify(contexto)
      });

      if (resposta.ok) {
        console.log("📦 Contexto mínimo enviado com sucesso.");
      } else {
        const erro = await resposta.text();
        console.error("❌ Erro ao enviar contexto:", erro);
      }
    } catch (erro) {
      console.error("❌ Erro no envio do contexto:", erro);
    }
  }

  async function enviarMensagem() {
    const texto = input.value.trim();
    if (!texto || !tokenSessao) return;

    adicionarMensagem("user", texto);
    input.value = "";

    try {
      const resposta = await fetch("https://sync.kognitiva.app/executar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenSessao}`
        },
        body: JSON.stringify({
          token_sessao: tokenSessao,
          objetivo_interacao: texto
        })
      });

      const dados = await resposta.json();
      adicionarMensagem("ai", dados.resposta || "⚠ Erro na resposta.");
    } catch (erro) {
      adicionarMensagem("ai", "⚠ Erro ao comunicar com a IA.");
      console.error("❌ Erro na execução da IA:", erro);
    }
  }

  function adicionarMensagem(tipo, texto) {
    const msg = document.createElement("div");
    msg.className = "message " + tipo;
    msg.textContent = texto;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
  }

  botao.addEventListener("click", enviarMensagem);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") enviarMensagem();
  });

  obterToken();
});
