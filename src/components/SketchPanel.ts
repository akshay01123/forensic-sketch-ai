export function createSketchPanel() {
  const aside = document.createElement('aside');
  aside.className = 'right-column';

  const panel = document.createElement('div');
  panel.className = 'sketch-panel';

  const header = document.createElement('div');
  header.className = 'sketch-header';
  header.textContent = 'Sketch Preview';

  const body = document.createElement('div');
  body.className = 'sketch-body';

  const placeholder = document.createElement('div');
  placeholder.className = 'sketch-placeholder';
  placeholder.id = 'preview';
  placeholder.textContent = 'Generated Sketch Will Appear Here';

  body.appendChild(placeholder);
  panel.appendChild(header);
  panel.appendChild(body);
  aside.appendChild(panel);

  function setLoading() {
    placeholder.innerHTML = '';
    const spinner = document.createElement('div');
    spinner.className = 'loading-spinner';
    placeholder.appendChild(spinner);
  }

  function setImage(dataUrl: string) {
    placeholder.innerHTML = '';
    const img = document.createElement('img');
    img.className = 'preview-image';
    img.src = dataUrl;
    img.alt = 'Generated sketch';
    placeholder.appendChild(img);
  }

  function setPlaceholder() {
    placeholder.innerHTML = 'Generated Sketch Will Appear Here';
  }

  return { el: aside, setLoading, setImage, setPlaceholder, previewEl: placeholder };
}

export default createSketchPanel;
