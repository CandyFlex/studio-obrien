/* Clover Dental Studio — interactions */
(function () {
  "use strict";

  /* ---------- sticky nav shadow ---------- */
  var navbar = document.getElementById("navbar");
  window.addEventListener("scroll", function () {
    navbar.classList.toggle("is-scrolled", window.scrollY > 10);
  }, { passive: true });

  /* ---------- mobile menu ---------- */
  var burger = document.getElementById("navBurger");
  var menu = document.getElementById("navMenu");
  burger.addEventListener("click", function () {
    var open = menu.classList.toggle("is-open");
    burger.classList.toggle("is-active", open);
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });

  /* dropdown toggles (tap on mobile, hover handled by CSS on desktop) */
  document.querySelectorAll(".nav-item.has-drop > .nav-link").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var item = btn.parentElement;
      var wasOpen = item.classList.contains("is-open");
      document.querySelectorAll(".nav-item.is-open").forEach(function (other) {
        other.classList.remove("is-open");
        other.querySelector(".nav-link").setAttribute("aria-expanded", "false");
      });
      if (!wasOpen) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  /* close menu when a dropdown link is chosen */
  menu.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      menu.classList.remove("is-open");
      burger.classList.remove("is-active");
      document.body.style.overflow = "";
    });
  });

  /* ---------- testimonial slider ---------- */
  var slider = document.getElementById("reviewSlider");
  if (slider) {
    var slides = slider.querySelectorAll(".slide");
    var dotsWrap = slider.querySelector(".slider-dots");
    var current = 0;
    var timer;

    slides.forEach(function (_, i) {
      var dot = document.createElement("button");
      dot.setAttribute("aria-label", "Go to review " + (i + 1));
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", function () { go(i); restart(); });
      dotsWrap.appendChild(dot);
    });
    var dots = dotsWrap.querySelectorAll("button");

    function go(i) {
      slides[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      current = (i + slides.length) % slides.length;
      slides[current].classList.add("is-active");
      dots[current].classList.add("is-active");
    }
    function restart() {
      clearInterval(timer);
      timer = setInterval(function () { go(current + 1); }, 6000);
    }

    slider.querySelector(".prev").addEventListener("click", function () { go(current - 1); restart(); });
    slider.querySelector(".next").addEventListener("click", function () { go(current + 1); restart(); });
    restart();
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- single-open FAQ ---------- */
  var faqs = document.querySelectorAll(".faq-item");
  faqs.forEach(function (item) {
    item.addEventListener("toggle", function () {
      if (item.open) {
        faqs.forEach(function (other) {
          if (other !== item) other.open = false;
        });
      }
    });
  });
})();
