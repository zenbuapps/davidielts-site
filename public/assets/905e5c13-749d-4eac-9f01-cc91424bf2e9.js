// nav shadow on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 12);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// mobile drawer
const drawer = document.getElementById('drawer');
document.getElementById('open-menu').addEventListener('click', () => drawer.classList.add('open'));
drawer.addEventListener('click', (e) => {
  if (e.target.closest('[data-close]')) drawer.classList.remove('open');
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') drawer.classList.remove('open'); });

// skill tabs (reviews page)
document.querySelectorAll('[data-tabs]').forEach((group) => {
  const tabs = group.querySelectorAll('.skill-tab');
  const panels = group.querySelectorAll('.skill-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('on'));
      panels.forEach((p) => p.classList.remove('on'));
      tab.classList.add('on');
      const panel = group.querySelector('#' + tab.dataset.target);
      if (panel) panel.classList.add('on');
    });
  });
});

// FAQ accordion
document.querySelectorAll('.faq-item').forEach((item) => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach((other) => {
      if (other !== item) { other.classList.remove('open'); other.querySelector('.faq-a').style.maxHeight = null; }
    });
    if (isOpen) { item.classList.remove('open'); a.style.maxHeight = null; }
    else { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; }
  });
});
