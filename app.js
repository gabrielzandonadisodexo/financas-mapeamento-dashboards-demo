const links = Array.from(document.querySelectorAll('.nav-item'));
const sections = links
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

function updateActiveLink() {
  const current = sections
    .map((section) => ({
      id: section.id,
      top: Math.abs(section.getBoundingClientRect().top)
    }))
    .sort((a, b) => a.top - b.top)[0];

  if (!current) return;

  for (const link of links) {
    link.classList.toggle('active', link.getAttribute('href') === `#${current.id}`);
  }
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${size.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} ${units[unit]}`;
}

async function loadManifest() {
  try {
    const response = await fetch('./manifest.json', { cache: 'no-store' });
    if (!response.ok) return;
    const manifest = await response.json();

    for (const [key, file] of Object.entries(manifest.files || {})) {
      const node = document.querySelector(`[data-file="${key}"]`);
      if (!node) continue;
      const size = formatBytes(file.size);
      node.textContent = [size, file.updatedAt].filter(Boolean).join(' | ');
    }
  } catch {
    // Metadata is optional; downloads stay available without it.
  }
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
window.addEventListener('resize', updateActiveLink);
updateActiveLink();
loadManifest();
