/* Terry Black's BBQ — interactions */
(function () {
  'use strict';

  /* ---- Mobile nav toggle ---- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });
    // close after tapping a link
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---- Seamless marquee: duplicate the group so -50% loops cleanly ---- */
  var track = document.getElementById('marqueeTrack');
  if (track) {
    var group = track.querySelector('.marquee__group');
    if (group) track.appendChild(group.cloneNode(true));
  }

  /* ---- Seamless social strip: duplicate items ---- */
  var social = document.getElementById('socialTrack');
  if (social) {
    social.querySelectorAll('.social__item').forEach(function (item) {
      social.appendChild(item.cloneNode(true));
    });
  }

  /* ---- Newsletter form (front-end only, no backend wired) ---- */
  var form = document.getElementById('signupForm');
  var thanks = document.getElementById('formThanks');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      form.querySelectorAll('input,select,button').forEach(function (el) {
        el.disabled = true;
      });
      if (thanks) thanks.hidden = false;
    });
  }
})();
