const $ = (id) => document.getElementById(id);
const messages = $("messages");
const input = $("messageInput");
let voiceEnabled = true;
let recognition = null;

function setState(state, title, description, chip) {
  document.body.classList.remove("listening", "processing");
  if (state === "listening" || state === "processing") document.body.classList.add(state);
  $("stateTitle").textContent = title;
  $("stateDescription").textContent = description;
  $("stateChipText").textContent = chip;
}
function addMessage(text, who) {
  const article = document.createElement("article");
  article.className = `message ${who}`;
  const label = document.createElement("div");
  label.className = "message-label";
  label.textContent = who === "assistant" ? "J.A.R.V.I.S. • AGORA" : "VOCÊ • AGORA";
  const p = document.createElement("p");
  p.textContent = text;
  article.append(label, p);
  messages.appendChild(article);
  messages.scrollTop = messages.scrollHeight;
}
function speak(text) {
  if (!voiceEnabled || !("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "pt-BR";
  utterance.rate = 1;
  window.speechSynthesis.speak(utterance);
}
function localReply(message) {
  const m = message.toLowerCase();
  if (m.includes("funç") || m.includes("capacidade")) return "Minha arquitetura prevê conversa por texto e voz, memória autorizada, pesquisa e automações. Neste protótipo, essas integrações ainda não estão conectadas.";
  if (m.includes("projeto") || m.includes("estado")) return "Estamos na versão 0.1: interface PWA e demonstração local. A integração segura com a OpenAI API e o backend ainda precisam ser implementados.";
  if (m.includes("memória")) return "A memória será adicionada em uma etapa própria. A proposta é guardar somente informações úteis e autorizadas, com opções para consultar e apagar dados.";
  if (m.includes("próximos") || m.includes("passos")) return "Próximas etapas: testar esta interface no Android, publicar em hospedagem HTTPS, criar um backend seguro e conectar a OpenAI API sem expor chaves no aplicativo.";
  if (m.includes("olá") || m.includes("oi")) return "Olá. Estou funcionando como protótipo local. Ainda não estou conectado ao serviço de inteligência artificial.";
  return "Recebi sua mensagem. No momento sou uma demonstração local; a conexão com a inteligência artificial será implementada pelo servidor numa próxima etapa.";
}
function send(text) {
  const clean = text.trim();
  if (!clean) return;
  addMessage(clean, "user");
  input.value = "";
  setState("processing", "Processando solicitação.", "Esta versão utiliza respostas locais de demonstração.", "PROCESSAMENTO LOCAL");
  window.setTimeout(() => {
    const reply = localReply(clean);
    addMessage(reply, "assistant");
    setState("idle", "À sua disposição.", "O núcleo está aguardando uma nova solicitação.", "AGUARDANDO COMANDO");
    speak(reply);
  }, 450);
}
$("chatForm").addEventListener("submit", (event) => {
  event.preventDefault();
  send(input.value);
});
$("clearButton").addEventListener("click", () => {
  messages.replaceChildren();
  addMessage("Terminal limpo. Estou aguardando uma nova solicitação.", "assistant");
});
document.querySelectorAll("[data-command]").forEach(button => {
  button.addEventListener("click", () => send(button.dataset.command));
});
$("voiceButton").addEventListener("click", () => {
  voiceEnabled = !voiceEnabled;
  $("voiceState").textContent = voiceEnabled ? "ATIVA" : "DESATIVADA";
  $("voiceButton").classList.toggle("active", voiceEnabled);
  if (!voiceEnabled && "speechSynthesis" in window) window.speechSynthesis.cancel();
});

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "pt-BR";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.onstart = () => setState("listening", "Estou ouvindo.", "Fale sua solicitação.", "RECONHECIMENTO DE VOZ");
  recognition.onresult = (event) => send(event.results[0][0].transcript);
  recognition.onerror = () => setState("idle", "Não consegui ouvir.", "Verifique a permissão do microfone e tente novamente.", "ERRO DE MICROFONE");
  recognition.onend = () => {
    if (document.body.classList.contains("listening")) setState("idle", "À sua disposição.", "O núcleo está aguardando uma nova solicitação.", "AGUARDANDO COMANDO");
  };
  $("micButton").addEventListener("click", () => {
    try { recognition.start(); } catch (_) { /* evita iniciar duas vezes */ }
  });
} else {
  $("micButton").addEventListener("click", () => {
    addMessage("O reconhecimento de voz não está disponível neste navegador. Tente abrir a PWA no Chrome para Android e permitir o microfone.", "assistant");
  });
}
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
