document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("inputMensagem");
  const botao = document.getElementById("botaoEnviar");
  const chat = document.getElementById("chatMessages");

  let tokenSessao = null;
  let clienteSelecionado = null;

  async function obterToken() {
    try {
      const resposta = await fetch("https://sync.kognitiva.app/proxy/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "visitante_web",
          ip: "000.000.000.000",
          user_agent: navigator.userAgent,
        }),
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

  async function enviarContextoCompleto(mensagem) {
    if (!tokenSessao || !clienteSelecionado) return;

    const contexto = {
      cliente_nome: clienteSelecionado,
      produto_interesse: "Plataforma SaaS IA",
      etapa_funil: "Negociação",
      objetivo_interacao: mensagem,
      canal_comunicacao: "Email",
      segmento: "Tecnologia",
      estilo_vendedor: "Consultivo",
      preferencia_output: "Explicativo",
      velocidade_desejada: "Normal",
      contexto_valido: true,
    };

    try {
      const resp = await fetch("https://sync.kognitiva.app/proxy/contexto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token_sessao: tokenSessao, contexto }),
      });

      if (!resp.ok) {
        console.error("❌ Falha ao enviar contexto completo.");
      } else {
        console.log("✅ Contexto completo enviado.");
      }
    } catch (err) {
      console.error("❌ Erro ao enviar contexto:", err);
    }
  }

  async function enviarMensagem() {
    const texto = input.value.trim();
    if (!texto || !tokenSessao || !clienteSelecionado) return;

    adicionarMensagem("user", texto);
    input.value = "";

    await enviarContextoCompleto(texto);

    try {
      const respostaIA = await fetch("https://sync.kognitiva.app/executar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenSessao}`,
        },
        body: JSON.stringify({
          token_sessao: tokenSessao,
          cliente_nome: clienteSelecionado,
          objetivo_interacao: texto,
        }),
      });

      const dados = await respostaIA.json();

      adicionarMensagem("ai", dados.resposta || "⚠ Erro na resposta.");
      if (dados.modelo_utilizado && dados.score_resposta != null) {
        adicionarMensagem(
          "ai",
          `🧠 Modelo: ${dados.modelo_utilizado} | Score: ${dados.score_resposta}`
        );
      }
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

  function selecionarCliente(nome) {
    clienteSelecionado = nome;
    localStorage.setItem("clienteSelecionado", nome);
    const msg = document.createElement("div");
    msg.className = "message ai";
    msg.textContent = `✅ Cliente selecionado: ${nome}`;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
  }

  // Recupera cliente salvo ao carregar a página
  document.addEventListener("DOMContentLoaded", () => {
    const clienteSalvo = localStorage.getItem("clienteSelecionado");
    if (clienteSalvo) {
      selecionarCliente(clienteSalvo);
    }
  });

  botao.addEventListener("click", enviarMensagem);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") enviarMensagem();
  });

  obterToken();

  // Exportar função selecionarCliente para uso global, caso necessário
  window.selecionarCliente = selecionarCliente;
});

