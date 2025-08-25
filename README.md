# Chat App

Projeto de chat em tempo real para estudo de JavaScript, sem fins lucrativos, desenvolvido por Falcon.

## Hierarquia do Projeto

1. **Estrutura principal (HTML)**
   - Header: informações do usuário, login/logout, alternância de tema.
   - Modal de login/cadastro: entrada do usuário, senha e avatar.
   - Lista de usuários online.
   - Área de mensagens (chat).
   - Status de digitação.
   - Formulário de envio de mensagem (texto, emoji, arquivo, áudio).
   - Footer: informações do projeto.

2. **Estilos (CSS)**
   - Layout geral e responsividade.
   - Estilos do header, modal, chat, formulário, footer.
   - Modo escuro/claro.
   - Comentários explicativos para cada seção.

3. **Lógica (JavaScript)**
   - Declaração de variáveis e elementos (no topo).
   - Funções utilitárias (ex: formatMessage, updateHeader).
   - Autenticação (login/cadastro/logout).
   - Tema escuro/claro.
   - Eventos de interface (envio de mensagem, gravação de áudio, digitação).
   - Comunicação com o servidor (Socket.io).
   - Renderização de mensagens e atualizações de interface.

## Funcionalidades

- Login/cadastro simples (localStorage, sem backend).
- Escolha de avatar.
- Envio de mensagens públicas e privadas.
- Envio de imagens, vídeos, áudios e links.
- Seletor de emojis.
- Indicação de usuário digitando.
- Alternância entre modo escuro/claro.
- Layout responsivo para desktop e mobile.

## Como usar

1. Instale as dependências do backend (Node.js):
   ```bash
   npm install express socket.io
   ```
2. Inicie o servidor:
   ```bash
   node server.js
   ```
3. Abra o `index.html` no navegador.

## Observações
- O projeto não utiliza banco de dados nem autenticação real.
- Todos os dados de login/cadastro ficam apenas no navegador do usuário.
- O objetivo é estudo e prática de JavaScript, HTML e CSS.

---
Desenvolvido por Falcon. Para fins educacionais.
