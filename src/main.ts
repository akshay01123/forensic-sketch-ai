document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="text-align:center; margin-top:60px;">
    <h1>AI Forensic Sketch Assistant</h1>
    <p>Welcome to my first AI application.</p>

    <div style="margin-top:20px;">
      <textarea id="textInput" placeholder="Describe the face (e.g. eye color, hair, scars)..." rows="4" style="width:60%; max-width:600px;"></textarea>
    </div>

    <div style="margin-top:12px;">
      <button id="submitText">Submit Text</button>
      <button id="startAudio" style="margin-left:8px;">🎤 Start Recording (Audio)</button>
    </div>

    <div id="output" style="margin-top:24px;"></div>
  </div>
`

function escapeHtml(s: string) {
  return s.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
}

const submitBtn = document.getElementById('submitText') as HTMLButtonElement | null;
const textInput = document.getElementById('textInput') as HTMLTextAreaElement | null;
const output = document.getElementById('output') as HTMLDivElement | null;

submitBtn?.addEventListener('click', async () => {
  const text = textInput?.value.trim() ?? '';
  if (!text) {
    if (output) output.textContent = 'Please enter a description.';
    return;
  }

  if (output) output.innerHTML = '<em>Processing text...</em>';

  // Placeholder processing: echo back the sanitized description.
  await new Promise((res) => setTimeout(res, 500));
  if (output) {
    output.innerHTML = `<strong>Received description:</strong><div style="white-space:pre-wrap; margin-top:8px;">${escapeHtml(text)}</div>`;
  }
});

const audioBtn = document.getElementById('startAudio') as HTMLButtonElement | null;
audioBtn?.addEventListener('click', () => {
  if (output) output.innerHTML = '<em>Audio feature is not enabled yet. Use text input for now.</em>';
});