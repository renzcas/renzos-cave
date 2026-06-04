// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const targetId = link.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Simple parallax effect on scroll
const parallaxLayers = document.querySelectorAll('.layer.parallax');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY || window.pageYOffset;
  parallaxLayers.forEach(layer => {
    const speed = layer.classList.contains('cockpit-grid') ? 0.1 :
                  layer.classList.contains('cockpit-glow') ? 0.15 :
                  layer.classList.contains('ascent-light') ? 0.12 :
                  layer.classList.contains('fire-glow') ? 0.18 :
                  layer.classList.contains('fire-embers') ? 0.22 :
                  layer.classList.contains('cave-fog') ? 0.2 : 0.1;
    layer.style.transform = `translateY(${scrollY * speed * -0.3}px)`;
  });
});

console.log("Renzo's Cave — ancient shadows to cyber light.");
