export function createNavBar() {
  const el = document.createElement('header');
  el.className = 'topbar';
  el.innerHTML = `
    <div class="title">AI Forensic Sketch Assistant</div>
    <nav class="nav-actions">
      <button class="btn small">New</button>
      <button class="btn small">Save</button>
    </nav>
  `;
  return el;
}

export default createNavBar;
