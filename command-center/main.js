async function loadUniverses() {
  const response = await fetch('/universes/');
  const text = await response.text();

  const parser = new DOMParser();
  const doc = parser.parseFromString(text, 'text/html');

  const links = [...doc.querySelectorAll('a')];
  const folders = links
    .map(a => a.getAttribute('href'))
    .filter(h => h.endsWith('/'));

  const list = document.getElementById('universe-list');

  folders.forEach(folder => {
    const name = folder.replace('/', '');

    const btn = document.createElement('button');
    btn.className = 'universe-btn';
    btn.textContent = name;

    btn.onclick = () => {
      window.open(`/universes/${name}/index.html`, '_blank');
    };

    list.appendChild(btn);
  });
}

loadUniverses();
