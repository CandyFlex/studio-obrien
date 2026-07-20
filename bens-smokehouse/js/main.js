/* Ben's Smokehouse — interactions */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Scroll reveal (fade/rise + polaroid settle) ---- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));

  /* stagger siblings that opt in via data-stagger on a parent */
  document.querySelectorAll('[data-stagger]').forEach(function (parent) {
    parent.querySelectorAll('.reveal').forEach(function (k, i) {
      k.style.setProperty('--d', (i * 0.09) + 's');
    });
  });

  if (reduce) {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var revealInView = function () {
      var vh = window.innerHeight;
      // once the page is scrolled to the bottom, reveal any stragglers
      var atBottom = (vh + window.pageYOffset) >= (document.documentElement.scrollHeight - 4);
      revealEls = revealEls.filter(function (el) {
        var r = el.getBoundingClientRect();
        if (atBottom || (r.top < vh * 0.88 && r.bottom > 0)) {
          el.classList.add('is-visible');
          return false; // stop tracking once revealed
        }
        return true;
      });
    };
    var ticking = false;
    var onScroll = function () {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(function () { revealInView(); ticking = false; });
      }
    };
    revealInView();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    window.addEventListener('load', revealInView);
  }

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
