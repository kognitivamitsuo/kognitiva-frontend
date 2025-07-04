
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
      } else {
        console.error("❌ Erro ao obter token:", dados);
      }
    } catch (erro) {
      console.error("❌ Erro na requisição do token:", erro);
    }
  }

  async function enviarMensagem() {
    const texto = input.value.trim();
    if (!texto || !tokenSessao) return;

    adicionarMensagem("user", texto);
    input.value = "";

    const respostaIA = await fetch("https://sync.kognitiva.app/executar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente_nome: "Cliente Teste",
        objetivo_interacao: texto
      })
    });

    const dados = await respostaIA.json();
    adicionarMensagem("ai", dados.resposta || "⚠ Erro na resposta.");
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

  obterToken(); // Inicializa token na carga da página
});

