// --- 1) Year in footer ---
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// --- 2) Active nav highlighting (aria-current) ---
// Works on pages in / and in /pages or /posts
(() => {
  const here = location.pathname.split('/').pop().toLowerCase() || 'index.html';
  document.querySelectorAll('nav a[href]').forEach(a => {
    const href = a.getAttribute('href')?.toLowerCase();
    if (!href) return;
    const name = href.split('/').pop();
    if (name === here) a.setAttribute('aria-current','page');
  });
})();

// --- 3) "Useful links" dropdown in the nav ---
(() => {
  const btn = document.getElementById('linksBtn');
  const panel = document.getElementById('linksPanel');
  if (!btn || !panel) return;

  function closePanel(){
    panel.hidden = true;
    btn.setAttribute('aria-expanded','false');
  }
  btn.addEventListener('click', () => {
    const willOpen = panel.hidden;
    panel.hidden = !willOpen;
    btn.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) panel.querySelector('a')?.focus();
  });
  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) closePanel();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });
})();

// --- 4) Dashboard EC progress (runs only if the table exists) ---
(() => {
  const table = document.getElementById('ecTable');
  if (!table) return;

  const totalEC = 60;
  const rows = table.querySelectorAll('tbody tr[data-ec]');
  const bar = document.getElementById('ecBar');
  const num = document.getElementById('ecEarned');

  function recalc(){
    let earned = 0;
    rows.forEach(tr => {
      const ec = Number(tr.dataset.ec || 0);
      const cell = tr.querySelector('.status');
      const txt = (cell?.textContent || '').trim().toLowerCase();
      if (txt.startsWith('passed')) earned += ec;

      cell?.classList.toggle('status--passed', txt.startsWith('passed'));
      cell?.classList.toggle('status--failed', txt.startsWith('failed'));
      cell?.classList.toggle('status--pending', txt.startsWith('not'));
    });
    const pct = Math.min(100, (earned / totalEC) * 100);
    if (bar) bar.style.width = pct + '%';
    if (num) num.textContent = earned;
  }

  // support live edits to the status column
  table.addEventListener('input', recalc);
  table.addEventListener('keyup', recalc);
  recalc();
})();
