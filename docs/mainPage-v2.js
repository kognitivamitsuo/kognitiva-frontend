
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("inputMensagem");
  const botao = document.getElementById("botaoEnviar");
  const chat = document.getElementById("chatMessages");
  const listaClientes = document.getElementById("listaClientes");

  let tokenSessao = null;
  let clienteAtual = null;
  let clientes = [];

  async function obterToken() {
    try {
      const resposta = await fetch("https://sync.kognitiva.app/proxy/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const dados = await resposta.json();
      tokenSessao = dados.token;
    } catch (erro) {
      console.error("Erro ao obter token:", erro);
    }
  }

  async function iniciarSessaoComCliente(nomeCliente) {
    clienteAtual = nomeCliente;
    if (!clientes.includes(nomeCliente)) {
      clientes.push(nomeCliente);
      clientes.sort();
      atualizarListaClientes();
    }
    adicionarMensagem("sistema", `Sessão iniciada com ${nomeCliente}`);
  }

  function atualizarListaClientes() {
    listaClientes.innerHTML = "";
    clientes.forEach((nome) => {
      const item = document.createElement("div");
      item.className = "clienteItem";
      item.textContent = nome;
      item.onclick = () => iniciarSessaoComCliente(nome);
      listaClientes.appendChild(item);
    });
  }

  function adicionarMensagem(tipo, texto) {
    const msg = document.createElement("div");
    msg.className = `mensagem ${tipo}`;
    msg.textContent = texto;
    chat.appendChild(msg);
    chat.scrollTop = chat.scrollHeight;
  }

  async function enviarMensagem() {
    const texto = input.value.trim();
    if (!texto || !clienteAtual) return;

    adicionarMensagem("usuario", texto);
    input.value = "";

    const contexto = await obterContexto(tokenSessao, clienteAtual);
    const payload = {
      mensagem_usuario: texto,
      cliente_nome: clienteAtual,
      contexto_cliente: contexto
    };

    try {
      const resposta = await fetch("https://sync.kognitiva.app/executar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenSessao}`
        },
        body: JSON.stringify(payload)
      });
      const dados = await resposta.json();
      adicionarMensagem("ia", dados.resposta);
      salvarContexto(tokenSessao, clienteAtual, dados.superprompt);
      exibirDiagnosticoFinal(dados.score_resposta, dados.modelo_utilizado);
    } catch (erro) {
      console.error("Erro ao enviar mensagem:", erro);
      adicionarMensagem("sistema", "⚠ Erro na IA. Modo alternativo ativado.");
    }
  }

  botao.addEventListener("click", enviarMensagem);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") enviarMensagem();
  });

  input.addEventListener("blur", () => {
    const texto = input.value.trim();
    if (texto.toLowerCase().startsWith("quero começar com cliente ")) {
      const nome = texto.split("cliente ")[1];
      if (nome) {
        iniciarSessaoComCliente(nome);
        input.value = "";
      }
    }
  });

  obterToken();
});

