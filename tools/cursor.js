(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 760px)').matches) return;

  let dot = document.querySelector('.cursor-dot');
  if (!dot) {
    dot = document.createElement('div');
    dot.className = 'cursor-dot';
    dot.setAttribute('aria-hidden', 'true');
    document.body.appendChild(dot);
  }

  let mouseX = -20;
  let mouseY = -20;
  let dotX = -20;
  let dotY = -20;

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = '34px';
      dot.style.height = '34px';
      dot.style.opacity = '.55';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.opacity = '1';
    });
  });

  function animateCursor() {
    dotX += (mouseX - dotX) * 0.16;
    dotY += (mouseY - dotY) * 0.16;
    dot.style.transform = `translate(${dotX}px, ${dotY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
})();
