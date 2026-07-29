import type { Message } from '../types';

export function createChatWindow() {
  const container = document.createElement('section');
  container.className = 'left-column';

  const card = document.createElement('div');
  card.className = 'chat-card';

  const header = document.createElement('div');
  header.className = 'chat-header';
  header.textContent = 'Conversation';

  const messages = document.createElement('div');
  messages.id = 'messages';
  messages.className = 'messages';
  messages.setAttribute('aria-live', 'polite');

  card.appendChild(header);
  card.appendChild(messages);
  container.appendChild(card);

  function appendMessage(m: Message) {
    const el = document.createElement('div');
    el.className = `message ${m.from}`;

    const bubble = document.createElement('div');
    bubble.className = 'bubble';
    bubble.innerHTML = `<span>${escapeHtml(m.text)}</span>`;

    const meta = document.createElement('div');
    meta.className = 'meta';
    const time = document.createElement('span');
    time.className = 'timestamp';
    const d = new Date(m.ts);
    time.textContent = d.toLocaleString();
    meta.appendChild(time);

    el.appendChild(bubble);
    el.appendChild(meta);
    messages.appendChild(el);
    messages.scrollTop = messages.scrollHeight;
  }

  function clear() { messages.innerHTML = ''; }

  function escapeHtml(s: string) {
    return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
  }

  return { el: container, appendMessage, clear, messagesEl: messages };
}

export default createChatWindow;
