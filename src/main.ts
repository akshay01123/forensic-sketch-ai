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
  // apply visual modifiers from the text to the sketch
  applyModifiers(text);
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
  let svg = '';
  // A set of small stylized, non-photorealistic templates for quick starting points.
  if (name === 'aamir') {
    svg = `
      <svg id="faceSvg" viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#111" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <path id="head" d="M50 110 C60 50 140 50 150 110 C140 160 60 160 50 110 Z" stroke-width="2" />
          <path id="hair" d="M40 70 C60 30 140 30 160 70" stroke-width="5" />
          <g id="eyes">
            <ellipse id="leftEye" cx="75" cy="100" rx="9" ry="5" stroke-width="1.6" />
            <ellipse id="rightEye" cx="125" cy="100" rx="9" ry="5" stroke-width="1.6" />
            <circle id="leftIris" cx="75" cy="100" r="3.6" fill="#444" />
            <circle id="rightIris" cx="125" cy="100" r="3.6" fill="#444" />
          </g>
          <path id="mouth" d="M80 138 q20 12 40 0" stroke-width="2" />
        </g>
      </svg>
    `;
  } else if (name === 'tom') {
    svg = `
      <svg id="faceSvg" viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#111" fill="none">
          <path id="head" d="M45 110 C65 40 135 40 155 110 C140 155 60 155 45 110 Z" stroke-width="2" />
          <path id="hair" d="M50 60 C70 35 130 35 150 60" stroke-width="5" />
          <path id="mouth" d="M70 140 Q100 155 130 140" stroke-width="2" />
        </g>
      </svg>
    `;
  } else if (name === 'leonardo') {
    svg = `
      <svg id="faceSvg" viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#111" fill="none">
          <path id="head" d="M50 110 C70 45 130 45 150 110 C140 160 60 160 50 110 Z" stroke-width="2" />
          <path id="beard" d="M70 135 C90 150 110 150 130 135" stroke-width="2.4" />
          <path id="hair" d="M45 70 C70 30 130 30 155 70" stroke-width="4" />
        </g>
      </svg>
    `;
  } else if (name === 'scarlett') {
    svg = `
      <svg id="faceSvg" viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#111" fill="none">
          <oval id="head" cx="100" cy="105" rx="50" ry="65" stroke-width="2" />
          <path id="longhair" d="M40 70 C60 140 140 140 160 70" stroke-width="4" />
          <g id="eyes"><circle id="leftIris" cx="75" cy="95" r="3.6" fill="#444" /><circle id="rightIris" cx="125" cy="95" r="3.6" fill="#444"/></g>
        </g>
      </svg>
    `;
  } else if (name === 'brad') {
    svg = `
      <svg id="faceSvg" viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#111" fill="none">
          <path id="head" d="M45 110 C65 45 135 45 155 110 C145 155 55 155 45 110 Z" stroke-width="2" />
          <path id="stubble" d="M70 135 C90 148 110 148 130 135" stroke-width="1.6" />
        </g>
      </svg>
    `;
  } else if (name === 'angelina') {
    svg = `
      <svg id="faceSvg" viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#111" fill="none">
          <path id="head" d="M50 100 C70 40 130 40 150 100 C140 150 60 150 50 100 Z" stroke-width="2" />
          <path id="lips" d="M85 135 q15 8 30 0" stroke-width="2" />
        </g>
      </svg>
    `;
  } else if (name === 'keanu') {
    svg = `
      <svg id="faceSvg" viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#111" fill="none">
          <path id="head" d="M45 110 C65 45 135 45 155 110 C145 155 55 155 45 110 Z" stroke-width="2" />
          <path id="longhair" d="M40 70 C60 30 140 30 160 70" stroke-width="4" />
          <path id="beard" d="M75 135 C95 150 105 150 125 135" stroke-width="1.8" />
        </g>
      </svg>
    `;
  } else if (name === 'emma') {
    svg = `
      <svg id="faceSvg" viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#111" fill="none">
          <path id="head" d="M50 100 C70 45 130 45 150 100 C140 145 60 145 50 100 Z" stroke-width="2" />
          <path id="hair" d="M40 70 C70 40 130 40 160 70" stroke-width="3" />
        </g>
      </svg>
    `;
  } else if (name === 'morgan') {
    svg = `
      <svg id="faceSvg" viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <g stroke="#111" fill="none">
          <path id="head" d="M50 105 C65 50 135 50 150 105 C145 150 55 150 50 105 Z" stroke-width="2" />
          <path id="mustache" d="M80 125 q20 8 40 0" stroke-width="2" />
        </g>
      </svg>
    `;
  } else {
    svg = `
      <svg id="faceSvg" viewBox="0 0 200 200" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="grain"><feTurbulence baseFrequency="0.8" numOctaves="1" seed="2" result="t"/><feColorMatrix type="saturate" values="0"/></filter>
        </defs>
        <g stroke="#222" stroke-linecap="round" stroke-linejoin="round" fill="none">
          <circle id="head" cx="100" cy="100" r="70" stroke-width="2" />
          <path id="hair" d="M30 70 C55 20 145 20 170 70" stroke-width="6" />
          <g id="eyes">
            <ellipse id="leftEye" cx="75" cy="95" rx="10" ry="6" stroke-width="1.8" />
            <ellipse id="rightEye" cx="125" cy="95" rx="10" ry="6" stroke-width="1.8" />
            <circle id="leftIris" cx="75" cy="95" r="4" fill="#666" />
            <circle id="rightIris" cx="125" cy="95" r="4" fill="#666" />
          </g>
          <path id="mouth" d="M75 130 Q100 150 125 130" stroke-width="2.4" />
        </g>
      </svg>
    `;
  }
  sketchArea.innerHTML = svg;
}

function isValidCssColor(v: string) {
  const s = (document.createElement('span') as HTMLSpanElement).style;
  s.color = '';
  s.color = v;
  return !!s.color;
}

function extractColorBeforeKeyword(t: string, keyword: string) {
  // match patterns like "brown hair", "light brown hair", or hex #aabbcc
  const hex = t.match(/#([0-9a-f]{3,6})\b/);
  if (hex) return `#${hex[1]}`;

  const reBefore = new RegExp("([a-z]+(?: [a-z]+){0,2})\\s+" + keyword);
  const m = t.match(reBefore);
  if (m) return m[1];

  return null;
}

function findAnyCssColorInText(t: string) {
  // look for hex first
  const hex = t.match(/#([0-9a-f]{3,6})\b/);
  if (hex) return `#${hex[1]}`;

  // check each word and two-word combos for valid CSS color
  const stop = new Set(['the','a','an','and','is','are','needs','to','be','color','hair','eyes','eye','with','on','add','remove','scar','scars','glasses','smile','smiling','frown','happy','sad']);
  const words = t.split(/[^a-z0-9#]+/).filter(Boolean);
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    if (stop.has(w)) continue;
    if (isValidCssColor(w)) return w;
    // two-word color like "light brown"
    if (i + 1 < words.length) {
      const combo = `${w} ${words[i+1]}`;
      if (!stop.has(words[i+1]) && isValidCssColor(combo)) return combo;
    }
  }
  return null;
}

function applyModifiers(text: string) {
  const t = text.toLowerCase();
  const svg = document.getElementById('faceSvg');
  if (!svg) return;

  // If user requests a template face, re-render the base template
  if (/template/.test(t)) {
    renderTemplate('default');
  }

  // celebrity detection: render known templates when user names them
  const celebMap: [RegExp, string][] = [
    [/aamir\s*khan|aamir|amir\s*khan/, 'aamir'],
    [/tom\s*cruise|tom\b/, 'tom'],
    [/leonardo\s*dicaprio|leonardo|leo\b/, 'leonardo'],
    [/scarlett\s*johansson|scarlett|scarlett\b/, 'scarlett'],
    [/brad\s*pitt|brad\b/, 'brad'],
    [/angelina\s+jolie|angelina|jolie\b/, 'angelina'],
    [/keanu\s*reeves|keanu|reeves\b/, 'keanu'],
    [/emma\s*watson|emma\b/, 'emma'],
    [/morgan\s*freeman|morgan|freeman\b/, 'morgan'],
  ];
  for (const [re, key] of celebMap) {
    if (re.test(t)) {
      renderTemplate(key);
      break;
    }
  }

  // hair color: support "brown hair" and "hair color brown" and hex
  let hairColor = extractColorBeforeKeyword(t, 'hair') || (t.match(/hair(?: color| is)?\s+([#a-z0-9 ]{3,20})/)?.[1] ?? null);
  if (hairColor) {
    hairColor = hairColor.trim();
    if (isValidCssColor(hairColor)) {
      const hairEl = document.getElementById('hair') as SVGElement | null;
      if (hairEl) hairEl.setAttribute('stroke', hairColor);
    }
  }

  // eyes: match "green eyes" or "eye color green"
  let eyeColor = extractColorBeforeKeyword(t, 'eyes') || extractColorBeforeKeyword(t, 'eye') || (t.match(/eye(?:s)?(?: color| is)?\s+([#a-z0-9 ]{3,20})/)?.[1] ?? null);
  if (!eyeColor && /eye/.test(t)) {
    eyeColor = findAnyCssColorInText(t);
  }
  if (eyeColor) {
    eyeColor = eyeColor.trim();
    if (isValidCssColor(eyeColor)) {
      const leftIris = document.getElementById('leftIris') as SVGCircleElement | null;
      const rightIris = document.getElementById('rightIris') as SVGCircleElement | null;
      if (leftIris) leftIris.setAttribute('fill', eyeColor);
      if (rightIris) rightIris.setAttribute('fill', eyeColor);
    }
  }

  // scar toggle
  const scar = document.getElementById('scar') as SVGLineElement | null;
  if (/scar|scars|scar on/.test(t)) {
    if (scar) scar.setAttribute('visibility', 'visible');
  } else {
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
    if (!document.getElementById('glasses')) {
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      g.setAttribute('id', 'glasses');
      g.setAttribute('stroke', '#222');
      g.setAttribute('fill', 'none');
      g.innerHTML = `
        <rect x="60" y="80" width="30" height="20" rx="6" stroke-width="1.8" />
        <rect x="110" y="80" width="30" height="20" rx="6" stroke-width="1.8" />
        <line x1="90" y1="90" x2="110" y2="90" stroke-width="1.8" />
      `;
      svg.appendChild(g);
    }
  } else {
    const g = document.getElementById('glasses');
    if (g) g.remove();
  }

  // slight sketchy effect: add dashed stroke to head
  const head = document.getElementById('head') as SVGCircleElement | null;
  if (head) head.setAttribute('stroke-dasharray', '4 3');
}

// ensure a template is present on load
renderTemplate('default');

// update TODO statuses
if (output) output.innerHTML = '<em>Template sketch ready below — describe changes and press Submit Text.</em>';