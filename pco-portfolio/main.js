// ============================================================================
// 1) Footer year
// ============================================================================
(() => {
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// ============================================================================
// 2) Active nav highlighting (works for /, /pages, /posts)
// ============================================================================
(() => {
  const here = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  document.querySelectorAll('nav a[href]').forEach(a => {
    const name = (a.getAttribute('href') || '').split('/').pop()?.toLowerCase();
    if (name && name === here) a.setAttribute('aria-current', 'page');
  });
})();

// ============================================================================
// 3) Nav dropdown: Useful links (click / outside / Esc)
// ============================================================================
(() => {
  const btn = document.getElementById('linksBtn');
  const panel = document.getElementById('linksPanel');
  if (!btn || !panel) return;

  const close = () => {
    panel.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
  };

  btn.addEventListener('click', () => {
    const willOpen = panel.hidden;
    panel.hidden = !willOpen;
    btn.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) panel.querySelector('a')?.focus();
  });

  document.addEventListener('click', (e) => {
    if (!panel.hidden && !panel.contains(e.target) && e.target !== btn) close();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });
})();

// ============================================================================
// 4) Dashboard EC progress (auto recalculates on edit)
// ============================================================================
(() => {
  const table = document.getElementById('ecTable');
  if (!table) return;

  const totalEC = 60;
  const rows = table.querySelectorAll('tbody tr[data-ec]');
  const bar  = document.getElementById('ecBar');
  const num  = document.getElementById('ecEarned');

  function recalc(){
    let earned = 0;
    rows.forEach(tr => {
      const ec   = Number(tr.dataset.ec || 0);
      const cell = tr.querySelector('.status');
      const txt  = (cell?.textContent || '').trim().toLowerCase();

      if (txt.startsWith('passed')) earned += ec;

      cell?.classList.toggle('status--passed',  txt.startsWith('passed'));
      cell?.classList.toggle('status--failed',  txt.startsWith('failed'));
      cell?.classList.toggle('status--pending', txt.startsWith('not'));
    });

    const pct = Math.min(100, (earned / totalEC) * 100);
    if (bar) bar.style.width = pct + '%';
    if (num) num.textContent = earned;
  }

  table.addEventListener('input', recalc);
  table.addEventListener('keyup',  recalc);
  recalc();
})();
