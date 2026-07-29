export function createMessageInput(onSend: (text: string) => void) {
  const wrapper = document.createElement('div');
  wrapper.className = 'input-area';

  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'messageInput';
  input.placeholder = "Describe the face or give instructions...";
  input.setAttribute('aria-label', 'Message input');

  const sendBtn = document.createElement('button');
  sendBtn.className = 'btn primary';
  sendBtn.id = 'sendBtn';
  sendBtn.textContent = 'Send';

  wrapper.appendChild(input);
  wrapper.appendChild(sendBtn);

  sendBtn.addEventListener('click', () => {
    const v = input.value.trim();
    if (!v) return;
    onSend(v);
    input.value = '';
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendBtn.click();
    }
  });

  return { el: wrapper, inputEl: input, sendBtn };
}

export default createMessageInput;
