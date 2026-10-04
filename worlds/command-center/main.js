// Recursively scan folders and find all worlds containing index.html
async function scanFolder(path) {
  const results = [];

  try {
    const response = await fetch(path);
    const text = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(text, "text/html");

    const links = [...doc.querySelectorAll("a")];

    // Extract subfolders
    const folders = links
      .map(a => a.getAttribute("href"))
      .filter(h => h.endsWith("/") && h !== "../");

    // Check if this folder contains an index.html
    const hasIndex = links.some(a => a.getAttribute("href") === "index.html");

    if (hasIndex) {
      results.push(path);
    }

    // Recursively scan subfolders
    for (const folder of folders) {
      const subPath = path + folder;
      const subResults = await scanFolder(subPath);
      results.push(...subResults);
    }

  } catch (err) {
    console.error("Error scanning folder:", path, err);
  }

  return results;
}

async function loadUniverses() {
  const list = document.getElementById("universe-list");

  // Start scanning from /universes/
  const worlds = await scanFolder("/universes/");

  worlds.forEach(worldPath => {
    // Extract folder name from path
    const name = worldPath.replace("/universes/", "").replace("/index.html", "");

    const btn = document.createElement("button");
    btn.className = "universe-btn";
    btn.textContent = name;

    btn.onclick = () => {
      window.open(worldPath, "_blank");
    };

    list.appendChild(btn);
  });
}

loadUniverses();
