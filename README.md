# Chat App

Projeto de chat em tempo real para estudo de JavaScript, sem fins lucrativos, desenvolvido por Falcon.

## Visual

Interface inspirada no Discord, com layout moderno, cores escuras, bordas arredondadas e responsividade.

## Estrutura do Projeto

```
public/
  ├── index.html
  ├── style.css
  └── app.js
server.js
package.json
```

- Todos os arquivos estáticos (HTML, CSS, JS) ficam na pasta `public`.
- O servidor Express serve os arquivos da pasta `public`.
- O Socket.io é utilizado para comunicação em tempo real.

## Funcionalidades

- Login/cadastro simples (localStorage, sem backend).
- Escolha de avatar.
- Envio de mensagens públicas e privadas.
- Envio de imagens, vídeos, áudios e links.
- Seletor de emojis.
- Indicação de usuário digitando.
- Alternância entre modo escuro/claro.
- Layout responsivo para desktop e mobile.
- Visual moderno inspirado no Discord.

## Como usar localmente

1. Instale as dependências do backend (Node.js):
   ```bash
   npm install
   ```
2. Inicie o servidor:
   ```bash
   npm start
   ```
3. Acesse `http://localhost:3000` no navegador.


## Observações
- O projeto não utiliza banco de dados nem autenticação real.
- Todos os dados de login/cadastro ficam apenas no navegador do usuário.
- O objetivo é estudo e prática de JavaScript, HTML e CSS.

---
Desenvolvido por Falcon. Para fins educacionais.
