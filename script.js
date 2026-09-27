document.addEventListener('DOMContentLoaded', function () {
  /* Shared mobile navigation: works with both old and newer page markup. */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav') || document.querySelector('.main-nav');

  if (toggle && nav) {
    if (!nav.id) nav.id = 'main-nav';
    toggle.setAttribute('aria-controls', nav.id);
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Open navigation');

    function closeNav() {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
    }

    function openNav() {
      nav.classList.add('open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation');
    }

    toggle.addEventListener('click', function () {
      var isOpen = nav.classList.contains('open');
      if (isOpen) closeNav();
      else openNav();
    });

    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeNav();
    });

    document.addEventListener('click', function (event) {
      if (!nav.classList.contains('open')) return;
      if (nav.contains(event.target) || toggle.contains(event.target)) return;
      closeNav();
    });

    /* Keep the legacy RAF research navigation enhancement. */
    if (!nav.querySelector('a[href="raf-awards.html"]')) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = 'raf-awards.html';
      a.textContent = 'RAF Awards';
      li.appendChild(a);

      var contactItem = Array.from(nav.querySelectorAll('li')).find(function (item) {
        var link = item.querySelector('a');
        return link && ['#consult', '#contact', 'index.html#contact'].includes(link.getAttribute('href'));
      });

      if (contactItem) nav.insertBefore(li, contactItem);
      else nav.appendChild(li);
    }
  }

  var yearEls = document.querySelectorAll('[data-year], #year');
  yearEls.forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
});
