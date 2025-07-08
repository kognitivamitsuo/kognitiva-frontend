Kognitiva v3.6 - Plataforma de Chat Inteligente

Visão Geral

A Kognitiva v3.6 é uma plataforma de chat inteligente construída para fornecer uma experiência interativa e personalizada, utilizando IA (GPT-3.5 / GPT-4). Ela está equipada com um fluxo cognitivo robusto, integração com backend, armazenamento de dados e feedback dinâmico. O objetivo principal é otimizar interações de vendas e atendimento ao cliente, com funcionalidades como diagnóstico de desempenho, feedback em tempo real e reaproveitamento de contexto.

Funcionalidades Principais

Mensagens interativas: Com bolhas de conversa para IA e usuário, feedback visual e diagnóstico final com base na pontuação.
Reaproveitamento de Sessão: Histórico de conversa recuperado através de Redis e PostgreSQL para uma experiência contínua.
Feedback do Usuário: Feedback com botões de 👍/👎 e comentários para melhorar a experiência da IA.
Diagnóstico Visual: Exibição automática de diagnóstico no final de cada interação, com feedback dinâmico.
Interface Responsiva: Design focado em dispositivos móveis, com uma barra lateral de clientes e chat centralizado.
Tecnologias Usadas

Frontend:
HTML5, CSS3 (design responsivo)
JavaScript (para interações com o backend e lógica de IA)
Backend:
Node.js (express para o servidor)
Redis (para armazenamento temporário de contexto)
PostgreSQL (para persistência de dados)
OpenAI API (para interações com GPT-3.5 / GPT-4)
Plataformas:
Render (para implantação do backend)
Google Sheets (fallback de armazenamento de dados)
Estrutura do Projeto

/frontend
    ├── index.html          # Estrutura principal da interface de chat
    ├── /css
    │   ├── style.css       # Estilo visual da plataforma
    ├── /js
    │   ├── executarIA.js    # Lógica para envio de mensagens e interação com a IA
    │   ├── feedbackBox.js   # Lógica de feedback do usuário
    │   ├── contextService.js # Gerenciamento de contexto (Redis/PostgreSQL)
    │   ├── diagnosticoFinal.js # Lógica de diagnóstico final baseado no score
    ├── /img
    │   ├── avatar_ia.png    # Avatar da IA
    │   ├── avatar_usuario.png # Avatar do usuário
    └── README.md            # Documentação do projeto
Requisitos

Node.js (versão 14 ou superior)
Redis (para armazenamento de dados temporários)
PostgreSQL (para persistência de dados)
Chave API OpenAI (para interações com GPT-3.5 / GPT-4)
Google Sheets API Key (opcional, para fallback)
Render Account (para deploy da aplicação backend)
Configuração do Projeto

1. Clonar o Repositório
git clone https://github.com/SeuUsuario/kognitiva-v3.6.git
cd kognitiva-v3.6
2. Instalar Dependências Backend
No diretório backend, instale as dependências do Node.js:

cd backend
npm install
3. Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz do diretório backend e adicione as seguintes variáveis de ambiente:

JWT_SECRET=seu_segredo_de_jwt
JWT_TTL=3600  # Tempo de expiração do token em segundos
MFA_SECRET=sua_chave_mfa
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgres://usuario:senha@localhost:5432/kognitiva
OPENAI_API_KEY=sua_chave_openai
GOOGLE_SHEETS_API_KEY=sua_chave_google_sheets
CRM_API_KEY=sua_chave_crm
CACHE_TTL=86400  # Tempo de vida do cache em segundos
MAX_REQUESTS=100  # Limite de requisições por minuto
RATE_LIMIT_WINDOW=60000  # Janela de rate limiting (em ms)
SYNC_URL=http://localhost:3000/sync
FRAMEWORK_VERSION=v3.6
4. Iniciar o Backend
Com as variáveis configuradas, inicie o servidor backend:

npm start
O backend estará acessível em http://localhost:3000.

5. Iniciar o Frontend
O frontend está pronto para ser visualizado em um servidor local. Você pode abrir o arquivo index.html diretamente no navegador ou usar um servidor de desenvolvimento simples (por exemplo, Live Server no VS Code).

6. Conectar ao Backend
Certifique-se de que o frontend esteja configurado para se comunicar com o backend. As URLs de API no frontend devem apontar para o servidor backend correto.

Funcionalidades de Implementação

1. Chat de Suporte Inteligente
O chat permite que o usuário interaja com a IA e obtenha respostas personalizadas.
A IA utiliza GPT-3.5 ou GPT-4 (via OpenAI) para gerar respostas baseadas no contexto do cliente.
O sistema armazena o histórico da conversa usando Redis e PostgreSQL, permitindo a continuidade entre sessões.
2. Feedback e Diagnóstico
O usuário pode fornecer feedback sobre as respostas da IA através de botões 👍/👎.
O diagnóstico é gerado automaticamente com base no score da resposta da IA, exibido ao final de cada interação.
As interações também são armazenadas para garantir rastreabilidade e análise de desempenho.
3. Reaproveitamento de Sessão
O contexto da sessão é reaproveitado de sessões anteriores, com histórico recuperado do Redis ou PostgreSQL, garantindo que o usuário não precise repetir informações.
Como Usar

Abrir o Chat: Após iniciar o backend e acessar a interface do frontend, o usuário pode começar a digitar no campo de entrada e interagir com a IA.
Fornecer Feedback: Ao final de cada interação, o usuário pode avaliar a resposta da IA com os botões de 👍/👎.
Diagnóstico: O sistema exibirá automaticamente um diagnóstico baseado na qualidade da interação, com um score indicando se a resposta foi satisfatória ou não.
Reaproveitamento de Contexto: Quando o cliente retornar, o sistema buscará o histórico de conversas anteriores e continuará a interação sem perder o contexto.
Contribuindo

Se você deseja contribuir para o projeto, siga as etapas abaixo:

Fork o Repositório.
Clone o repositório para sua máquina local.
Crie uma branch para a sua funcionalidade:
git checkout -b nova-funcionalidade
Faça suas alterações e commit.
Push para o repositório remoto:
git push origin nova-funcionalidade
Abra um Pull Request.
Licença

Este projeto está licenciado sob a MIT License. Veja o arquivo LICENSE para mais detalhes.

