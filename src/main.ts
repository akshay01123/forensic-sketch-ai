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

// --- Sketch area: render a simple SVG template and apply modifiers ---
const sketchArea = document.createElement('div');
sketchArea.id = 'sketchArea';
sketchArea.style.cssText = 'margin:18px auto; width:320px; height:320px; border:1px solid #ddd; display:block; padding:8px; background:#fff;';
document.querySelector<HTMLDivElement>('#app')!.appendChild(sketchArea);

function renderTemplate(name = 'default') {
  const svg = `
    <svg id="faceSvg" viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <circle id="head" cx="100" cy="100" r="70" fill="#ffe0c9" stroke="#333"/>
      <g id="hairGroup">
        <ellipse id="hair" cx="100" cy="60" rx="80" ry="40" fill="#4b3621" />
      </g>
      <circle id="leftEye" cx="75" cy="95" r="9" fill="#fff" stroke="#333" />
      <circle id="rightEye" cx="125" cy="95" r="9" fill="#fff" stroke="#333" />
      <circle id="leftPupil" cx="75" cy="95" r="4" fill="#222" />
      <circle id="rightPupil" cx="125" cy="95" r="4" fill="#222" />
      <path id="mouth" d="M75 130 Q100 150 125 130" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round" />
      <line id="scar" x1="140" y1="120" x2="160" y2="100" stroke="#a33" stroke-width="3" visibility="hidden" />
    </svg>
  `;
  sketchArea.innerHTML = svg;
}

function applyModifiers(text: string) {
  const t = text.toLowerCase();
  const svg = document.getElementById('faceSvg');
  if (!svg) return;

  // hair color
  const hairMatch = t.match(/hair (?:color )?(?:is )?(\b\w+\b)/);
  if (hairMatch) {
    const hair = document.getElementById('hair') as SVGEllipseElement | null;
    if (hair) hair.setAttribute('fill', hairMatch[1]);
  }

  // eye color
  const eyeMatch = t.match(/eye(?:s)? (?:color )?(?:is )?(\b\w+\b)/);
  if (eyeMatch) {
    const leftPupil = document.getElementById('leftPupil') as SVGCircleElement | null;
    const rightPupil = document.getElementById('rightPupil') as SVGCircleElement | null;
    if (leftPupil) leftPupil.setAttribute('fill', eyeMatch[1]);
    if (rightPupil) rightPupil.setAttribute('fill', eyeMatch[1]);
  }

  // scar
  if (/scar|scars|scar on/.test(t)) {
    const scar = document.getElementById('scar') as SVGLineElement | null;
    if (scar) scar.setAttribute('visibility', 'visible');
  } else {
    const scar = document.getElementById('scar') as SVGLineElement | null;
    if (scar) scar.setAttribute('visibility', 'hidden');
  }

  // expression: smile/frown
  const mouth = document.getElementById('mouth') as SVGPathElement | null;
  if (mouth) {
    if (/smile|smiling|happy/.test(t)) {
      mouth.setAttribute('d', 'M75 125 Q100 150 125 125');
    } else if (/frown|sad|unhappy/.test(t)) {
      mouth.setAttribute('d', 'M75 140 Q100 115 125 140');
    } else {
      mouth.setAttribute('d', 'M75 130 Q100 150 125 130');
    }
  }

  // glasses
  if (/glasses|spectacles/.test(t)) {
    // add simple glasses if not present
    if (!document.getElementById('glasses')) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('id', 'glasses');
      g.innerHTML = `
        <rect x="60" y="80" width="30" height="20" rx="6" fill="none" stroke="#333" stroke-width="2" />
        <rect x="110" y="80" width="30" height="20" rx="6" fill="none" stroke="#333" stroke-width="2" />
        <line x1="90" y1="90" x2="110" y2="90" stroke="#333" stroke-width="2" />
      `;
      svg.appendChild(g);
    }
  } else {
    const g = document.getElementById('glasses');
    if (g) g.remove();
  }
}

// ensure a template is present on load
renderTemplate('default');

// update TODO statuses
if (output) output.innerHTML = '<em>Template sketch ready below — describe changes and press Submit Text.</em>';