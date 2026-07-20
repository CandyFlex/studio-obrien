/* Queen City Comfort Co. — functional behavior */
(function () {
  'use strict';

  // Current year in footer
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  // Mobile nav toggle
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Mega menus: hover works via CSS on desktop; tap-to-open on touch/mobile.
  document.querySelectorAll('.has-mega > a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      // Only intercept when the mobile toggle is visible (menus stacked)
      if (window.matchMedia('(max-width:960px)').matches) {
        e.preventDefault();
        link.parentElement.classList.toggle('open');
      }
    });
  });

  // Lead form: client-side validation + friendly confirmation.
  // Wire the fetch() block to a real endpoint (Gravity Forms / CRM) later.
  var form = document.getElementById('lead-form');
  var status = document.getElementById('lf-status');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';

      var name = form.name.value.trim();
      var phone = form.phone.value.trim();
      var email = form.email.value.trim();

      if (!name || !phone || !email) {
        status.classList.add('err');
        status.textContent = 'Please fill in your name, phone, and email.';
        return;
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
        status.classList.add('err');
        status.textContent = 'Please enter a valid email address.';
        return;
      }

      /* Replace with a real submission, e.g.:
         fetch('/api/lead', { method:'POST', body:new FormData(form) })
           .then(...) */
      status.classList.add('ok');
      status.textContent = 'Thanks, ' + name + '! We received your request and will call you shortly.';
      form.reset();
    });
  }
})();
