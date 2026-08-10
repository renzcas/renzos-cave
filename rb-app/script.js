const panelContainer = document.getElementById("panel-container");

function loadPanel(name) {
    fetch(`panels/${name}.html`)
        .then(res => res.text())
        .then(html => panelContainer.innerHTML = html)
        .catch(err => panelContainer.innerHTML = "Panel load error.");
}

document.querySelectorAll("#mode-switcher button").forEach(btn => {
    btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;
        loadPanel(mode);
    });
});

// Load default panel
loadPanel("recon");
