document.addEventListener('DOMContentLoaded', function () {
  // Only run on the homepage (body gets `home` class on index)
  if (!document.body.classList.contains('home')) return;

  const nav = document.getElementById('sidebar-nav-links');
  if (!nav) return;

  // Consider only links that point to an in-page anchor (have a hash)
  const links = Array.from(nav.querySelectorAll('a')).filter(a => a.hash && a.hash.length > 1);
  if (!links.length) return;

  // Map links to existing sections
  const linkToSection = links
    .map(a => {
      const id = a.hash.slice(1);
      const el = document.getElementById(id);
      return el ? { link: a, section: el } : null;
    })
    .filter(Boolean);

  if (!linkToSection.length) return;

  let activeLink = null;

  function updateActive() {
    // Choose the section closest to the top but not below a threshold
    const offset = 150; // px from top to consider "active"
    let current = linkToSection[0];

    for (const item of linkToSection) {
      const rect = item.section.getBoundingClientRect();
      if (rect.top <= offset) {
        current = item;
      }
    }

    if (!current) return;

    if (activeLink && activeLink !== current.link) activeLink.classList.remove('active');
    if (current.link && current.link !== activeLink) {
      current.link.classList.add('active');
      activeLink = current.link;
    }
  }

  // Efficient scroll handler
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        updateActive();
        ticking = false;
      });
      ticking = true;
    }
  }

  document.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);

  // When clicking a link, update the active state shortly after the jump
  linkToSection.forEach(({ link }) => {
    link.addEventListener('click', () => setTimeout(updateActive, 120));
  });

  // Initialize
  updateActive();
});
