/* ============================================================================
   preview.js — injects the coded website-preview mocks into their frames and
   pauses them when off-screen. The animation itself is 100% CSS (preview.css);
   this file only builds the DOM and manages play/pause for performance.

   Usage: put a placeholder in the frame and load this script (defer):
     <div data-preview="desktop"></div>   inside .v5-screen
     <div data-preview="mobile"></div>    inside .v5-phone-screen
   ========================================================================= */
(function () {
  'use strict';

  var CURSOR_SVG =
    '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<path d="M5 3l14 8.5-6 1.4 3.4 6.2-2.6 1.4-3.4-6.3L5 20V3z" ' +
    'fill="#fff" stroke="#12141a" stroke-width="1.1" stroke-linejoin="round"/></svg>';

  var TEMPLATES = {
    desktop:
      '<div class="pv pv--desktop">' +
        '<div class="pv-topbar">' +
          '<div class="pv-logo"></div><div class="pv-navdot"></div>' +
          '<div class="pv-navlink"></div><div class="pv-navlink"></div>' +
          '<div class="pv-navlink"></div><div class="pv-navcta"></div>' +
        '</div>' +
        '<div class="pv-page">' +
          '<div class="pv-hero">' +
            '<div class="pv-eyebrow"></div>' +
            '<div class="pv-h1"></div><div class="pv-h1 pv-h1--2"></div>' +
            '<div class="pv-lead"></div><div class="pv-lead pv-lead--2"></div>' +
            '<div class="pv-herobtns"><div class="pv-btn pv-btn--pri"></div>' +
            '<div class="pv-btn pv-btn--sec"></div></div>' +
          '</div>' +
          '<div class="pv-cards">' +
            '<div class="pv-card"><div class="pv-thumb"></div>' +
              '<div class="pv-cbar"></div><div class="pv-cbar pv-cbar--s"></div></div>' +
            '<div class="pv-card pv-card--target">' +
              '<div class="pv-card__state pv-card__before"><div class="pv-thumb"></div>' +
                '<div class="pv-cbar"></div><div class="pv-cbar pv-cbar--s"></div></div>' +
              '<div class="pv-card__state pv-card__after"><div class="pv-thumb"></div>' +
                '<div class="pv-cbar"></div><div class="pv-cbar pv-cbar--s"></div></div>' +
              '<div class="pv-badge">Updated</div>' +
              '<div class="pv-marquee"><span class="pv-handle tl"></span>' +
                '<span class="pv-handle tr"></span><span class="pv-handle bl"></span>' +
                '<span class="pv-handle br"></span></div>' +
              '<div class="pv-mqlabel">Section · Featured</div>' +
            '</div>' +
            '<div class="pv-card"><div class="pv-thumb"></div>' +
              '<div class="pv-cbar"></div><div class="pv-cbar pv-cbar--s"></div></div>' +
          '</div>' +
          '<div class="pv-band">' +
            '<div class="pv-bandtext">' +
              '<div class="pv-bar" style="width:70%"></div>' +
              '<div class="pv-bar" style="width:52%"></div>' +
              '<div class="pv-bar" style="width:40%"></div></div>' +
            '<div class="pv-bandimg"></div>' +
          '</div>' +
        '</div>' +
        '<div class="pv-cursor">' + CURSOR_SVG + '<div class="pv-click"></div></div>' +
      '</div>',

    mobile:
      '<div class="pv pv--mobile">' +
        '<div class="pv-topbar"><div class="pv-logo"></div><div class="pv-navdot"></div></div>' +
        '<div class="pv-mstack">' +
          '<div class="pv-mpage pv-mpage--home">' +
            '<div class="pv-mscroll">' +
              '<div class="pv-mhero"></div>' +
              '<div class="pv-mrow"><div class="pv-mtile"></div>' +
                '<div class="pv-mtile pv-mtile--tap"></div></div>' +
              '<div class="pv-mline"></div><div class="pv-mline pv-mline--s"></div>' +
              '<div class="pv-mcardbig"></div>' +
              '<div class="pv-mline"></div><div class="pv-mline pv-mline--s"></div>' +
              '<div class="pv-mcardbig"></div>' +
            '</div>' +
          '</div>' +
          '<div class="pv-mpage pv-mpage--detail">' +
            '<div class="pv-mdback"></div>' +
            '<div class="pv-mdhero"></div>' +
            '<div class="pv-mdbody"><div class="pv-mdline"></div>' +
              '<div class="pv-mdline pv-mdline--s"></div><div class="pv-mdline"></div>' +
              '<div class="pv-mdline pv-mdline--s"></div></div>' +
            '<div class="pv-shimmer"><div class="pv-spin"></div></div>' +
          '</div>' +
          '<div class="pv-tap"></div>' +
        '</div>' +
      '</div>'
  };

  function mount() {
    var hooks = document.querySelectorAll('[data-preview]');
    var mounted = [];
    for (var i = 0; i < hooks.length; i++) {
      var hook = hooks[i];
      var kind = hook.getAttribute('data-preview');
      if (!TEMPLATES[kind] || hook.dataset.pvMounted) continue;
      hook.innerHTML = TEMPLATES[kind];
      hook.dataset.pvMounted = '1';
      mounted.push(hook.firstChild);
    }

    // QA hook: ?pvfreeze=<seconds> freezes every mock at that point in its loop
    // (uniform negative animation-delay), so a screenshot can capture one beat.
    var freeze = new URLSearchParams(window.location.search).get('pvfreeze');
    if (freeze !== null) {
      var st = document.createElement('style');
      st.textContent = '.pv *{animation-delay:-' + parseFloat(freeze) +
        's !important;animation-play-state:paused !important}';
      document.head.appendChild(st);
      return; // skip the observer so nothing un-freezes it
    }

    // Pause CSS animations while the section is off-screen (perf + battery).
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          e.target.classList.toggle('pv--paused', !e.isIntersecting);
        });
      }, { rootMargin: '120px' });
      mounted.forEach(function (el) { if (el && el.classList) io.observe(el); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();
