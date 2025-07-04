document.addEventListener("DOMContentLoaded", async () => {
  const input = document.getElementById("inputMensagem");
  const botao = document.getElementById("botaoEnviar");
  const chat = document.getElementById("chatMessages");
  const clientList = document.getElementById("clientList");

  let tokenSessao = null;
  let clienteSelecionado = null;

  function adicionarMensagem(tipo, texto) {
    const msg = document.createElement("div");
    msg.className = "message " + tipo;
    msg.textContent = texto;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
  }

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
        alert("Erro ao obter token de sessão.");
      }
    } catch (erro) {
      console.error("❌ Erro na requisição do token:", erro);
      alert("Erro de conexão ao obter token.");
    }
  }

  async function enviarMensagem() {
    const texto = input.value.trim();
    if (!texto) return;
    if (!clienteSelecionado) return alert("⚠ Selecione um cliente na lista.");
    if (!tokenSessao) return alert("⚠ Token de sessão não disponível.");

    adicionarMensagem("user", texto);
    input.value = "";
    adicionarMensagem("ai", "⌛ Processando resposta...");

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
      const loadingMsg = [...chat.children].find(div => div.textContent.includes("⌛"));
      if (loadingMsg) loadingMsg.remove();
      adicionarMensagem("ai", dados.resposta || "⚠ Erro na resposta da IA.");

      if (dados.modelo_utilizado && dados.score_resposta != null) {
        adicionarMensagem("ai", `🧠 Modelo: ${dados.modelo_utilizado} | Score: ${dados.score_resposta}`);
      }
    } catch (erro) {
      adicionarMensagem("ai", "⚠ Erro ao comunicar com a IA.");
      console.error("❌ Erro na execução da IA:", erro);
    }
  }

  function renderizarClientes(nomes) {
    clientList.innerHTML = "";
    if (!nomes.length) {
      const li = document.createElement("li");
      li.textContent = "Nenhum cliente encontrado.";
      li.style.color = "#999";
      clientList.appendChild(li);
      return;
    }
    nomes.sort((a, b) => a.localeCompare(b));
    nomes.forEach(nome => {
      const li = document.createElement("li");
      li.textContent = nome;
      li.onclick = () => selecionarCliente(nome);
      clientList.appendChild(li);
    });
  }

  function selecionarCliente(nome) {
    clienteSelecionado = nome;
    localStorage.setItem("clienteSelecionado", nome);
    adicionarMensagem("ai", `✅ Cliente selecionado: ${nome}`);
  }

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      enviarMensagem();
    }
  });

  botao.addEventListener("click", enviarMensagem);

  const placeholder = document.createElement("li");
  placeholder.textContent = "Carregando clientes...";
  placeholder.style.color = "#888";
  clientList.appendChild(placeholder);

  await obterToken();
  const nomesClientes = ["Oriente Marketing", "Nova Era Logística", "Grupo SCC"];
  renderizarClientes(nomesClientes);

  const salvo = localStorage.getItem("clienteSelecionado");
  if (salvo && nomesClientes.includes(salvo)) selecionarCliente(salvo);
});


