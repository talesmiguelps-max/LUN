# J.A.R.V.I.S. — PWA Prototype 0.1

Este é um protótipo de interface instalável (PWA) para Android. Ele contém:
- interface responsiva;
- terminal de conversa com respostas locais de demonstração;
- síntese de voz do navegador;
- reconhecimento de voz quando o navegador oferece suporte;
- service worker para cache básico.

## Importante
Esta versão **ainda não está conectada à OpenAI API**. As respostas são locais e demonstrativas. Não coloque uma chave de API em `app.js`, HTML ou qualquer arquivo enviado ao navegador.

## Como testar pelo celular
1. Extraia o ZIP ou envie os arquivos para um repositório GitHub.
2. Publique a pasta em um serviço de hospedagem HTTPS (por exemplo, GitHub Pages ou Replit).
3. Abra o endereço HTTPS no Chrome para Android.
4. Permita o microfone quando solicitado.
5. No menu do Chrome, escolha **Instalar app** ou **Adicionar à tela inicial**, se a opção estiver disponível.

O service worker e a instalação PWA exigem HTTPS (ou localhost durante desenvolvimento).

## Próxima etapa técnica
Criar um backend FastAPI hospedado separadamente. O backend guardará a chave da OpenAI API como variável secreta e receberá as mensagens do aplicativo por HTTPS. Só então o chat poderá usar o modelo GPT real.

## Estrutura
- `index.html` — interface
- `styles.css` — identidade visual
- `app.js` — interação, voz e respostas demonstrativas
- `manifest.webmanifest` — configuração PWA
- `sw.js` — cache offline básico
- `icon.svg` — ícone vetorial
