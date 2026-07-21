/* ZENITH — scroll choreography
   Scrubbed zoom hero (GSAP + ScrollTrigger), IntersectionObserver reveals,
   parallax depth, scroll-linked counters. Respects prefers-reduced-motion. */

(function () {
  "use strict";

  // Motion override: ?motion=force, or the "Enable animations" pill (persisted
  // in localStorage), bypasses prefers-reduced-motion. ?motion=off clears it.
  if (/[?&]motion=off/.test(window.location.search)) {
    try { localStorage.removeItem("cityrock-motion"); } catch (e) {}
  }
  var storedMotion = null;
  try { storedMotion = localStorage.getItem("cityrock-motion"); } catch (e) {}
  var forceMotion = /[?&]motion=force/.test(window.location.search) || storedMotion === "force";
  if (forceMotion) document.documentElement.classList.add("force-motion");
  var reduced = !forceMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGsap = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";

  /* ---------- nav background after leaving the top ---------- */
  var nav = document.querySelector(".nav");
  var onScrollNav = function () {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  window.addEventListener("scroll", onScrollNav, { passive: true });
  onScrollNav();

  /* ---------- reveal-on-enter (IntersectionObserver) ---------- */
  var revealTargets = document.querySelectorAll(".reveal, .rule, .story--send");
  if (reduced || !("IntersectionObserver" in window)) {
    revealTargets.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    revealTargets.forEach(function (el) { io.observe(el); });
  }

  if (reduced || !hasGsap) {
    // Static fallback: the wide massif view stays as the hero image; captions
    // stay hidden. Reduced-motion users get an opt-in pill for full motion.
    if (reduced) {
      var pill = document.createElement("button");
      pill.className = "motion-toggle";
      pill.type = "button";
      pill.textContent = "Enable animations";
      pill.addEventListener("click", function () {
        try { localStorage.setItem("cityrock-motion", "force"); } catch (e) {}
        window.location.reload();
      });
      document.body.appendChild(pill);
    }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== "undefined") gsap.registerPlugin(ScrollToPlugin);
  var mm = gsap.matchMedia();

  /* ---------- smooth anchor scrolling ---------- */
  if (typeof ScrollToPlugin !== "undefined") {
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (e) {
        var sel = link.getAttribute("href");
        var target = sel === "#top" ? 0 : document.querySelector(sel);
        if (target === null) return;
        e.preventDefault();
        var yPos = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY;
        var dist = Math.abs(yPos - window.scrollY);
        gsap.to(window, {
          scrollTo: { y: yPos, autoKill: true },
          duration: Math.min(2.4, 0.6 + dist / 4000),
          ease: "power2.inOut",
          overwrite: "auto"
        });
      });
    });
  }

  /* ---------- marquee: word strip drifts sideways with scroll ---------- */
  var marqueeTrack = document.querySelector(".marquee__track");
  if (marqueeTrack) {
    gsap.fromTo(marqueeTrack, { xPercent: 0 }, {
      xPercent: -28,
      ease: "none",
      scrollTrigger: {
        trigger: ".marquee",
        start: "top bottom",
        end: "bottom top",
        scrub: 0.4
      }
    });
  }

  /* ---------- page progress bar ---------- */
  gsap.to(".progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: {
      trigger: "main",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3
    }
  });

  /* ---------- pinned hero: massif -> wall -> climber ---------- */
  mm.add(
    {
      isDesktop: "(min-width: 821px)",
      isMobile: "(max-width: 820px)"
    },
    function (ctx) {
      var isMobile = ctx.conditions.isMobile;

      var tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: ".zoom",
          start: "top top",
          end: isMobile ? "+=260%" : "+=380%",
          scrub: 0.6,
          pin: ".zoom__viewport",
          anticipatePin: 1
        }
      });

      var zoomMax = isMobile ? 2.0 : 2.5;
      var caption = function (i) {
        return ".stage-caption[data-caption='" + i + "']";
      };

      /* 0 – 1.4 : hero copy departs, hint fades */
      tl.to(".hero-copy", { opacity: 0, y: -50, duration: 1.2, ease: "power1.in" }, 0)
        .to(".scroll-hint", { opacity: 0, duration: 0.5 }, 0)

        /* stage 1: the massif — slow push-in, then blow past it */
        .fromTo(".stage--far img", { scale: 1 }, { scale: 1.55, duration: 3.4 }, 0)
        .fromTo(caption(0), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power1.out" }, 1.1)
        .to(caption(0), { opacity: 0, y: -18, duration: 0.45, ease: "power1.in" }, 2.9)
        .to(".stage--far img", { scale: zoomMax, duration: 1.3 }, 3.4)
        .to(".stage--far", { opacity: 0, duration: 1.0 }, 3.6)

        /* stage 2: the wall — cross-dissolves in while the push-in continues */
        .fromTo(".stage--wall", { opacity: 0 }, { opacity: 1, duration: 1.0 }, 3.55)
        .fromTo(".stage--wall img", { scale: 1 }, { scale: 1.18, duration: 1.35 }, 3.45)
        .to(".stage--wall img", { scale: 1.6, duration: 2.5 }, 4.8)
        .fromTo(caption(1), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.5, ease: "power1.out" }, 5.0)
        .to(caption(1), { opacity: 0, y: -18, duration: 0.45, ease: "power1.in" }, 6.6)
        .to(".stage--wall img", { scale: zoomMax, duration: 1.2 }, 7.3)
        .to(".stage--wall", { opacity: 0, duration: 0.95 }, 7.45)

        /* stage 3: the climber — settle, hold */
        .fromTo(".stage--climber", { opacity: 0 }, { opacity: 1, duration: 0.95 }, 7.4)
        .fromTo(".stage--climber img", { scale: 1 }, { scale: 1.08, duration: 1.3 }, 7.3)
        .fromTo(caption(2), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.55, ease: "power1.out" }, 8.7)
        .to(".stage--climber img", { scale: 1.2, duration: 1.4 }, 8.6);

      return function () { tl.scrollTrigger && tl.scrollTrigger.kill(); tl.kill(); };
    }
  );

  /* ---------- parallax depth (desktop only) ---------- */
  mm.add("(min-width: 821px)", function () {
    gsap.utils.toArray("[data-speed]").forEach(function (el) {
      var speed = parseFloat(el.getAttribute("data-speed")) || 0;
      gsap.fromTo(
        el,
        { yPercent: -speed },
        {
          yPercent: speed,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8
          }
        }
      );
    });
  });

  /* ---------- side rope: climber abseils down with reading progress ---------- */
  var ropeLine = document.querySelector(".rope-line");
  if (ropeLine) {
    var ropeClimber = ropeLine.querySelector(".rope-line__climber");
    gsap.set(ropeClimber, { xPercent: -50, x: 6 }); // +6px seats him on the holds

    // fade in once the hero zoom hands off to the content sections
    gsap.to(ropeLine, {
      opacity: 1,
      ease: "none",
      scrollTrigger: {
        trigger: ".story--approach",
        start: "top 90%",
        end: "top 55%",
        scrub: 0.4
      }
    });

    // send the wall: start at the bottom of the holds and top out at the CTA
    gsap.fromTo(ropeClimber, {
      y: function () { return ropeLine.clientHeight - 58; }
    }, {
      y: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".story--approach",
        start: "top 75%",
        endTrigger: ".cta",
        end: "bottom bottom",
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    });
  }

  /* ---------- stats: route line draws + counters count with scroll ---------- */
  var routePath = document.querySelector(".route-path");
  if (routePath) {
    var len = routePath.getTotalLength();
    routePath.style.strokeDasharray = len;
    routePath.style.strokeDashoffset = len;

    var statsTl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: ".stats",
        start: "top 75%",
        end: "bottom 65%",
        scrub: 0.5
      }
    });

    statsTl.to(routePath, { strokeDashoffset: 0, duration: 10 }, 0)
           .to(".route-summit", { opacity: 1, duration: 0.6 }, 9.2);
  }

  /* Counters count up once when they enter view, then hold — the numbers are
     facts, so they must not read as different values mid-scroll. */
  ScrollTrigger.create({
    trigger: ".stats__grid",
    start: "top 82%",
    once: true,
    onEnter: function () {
      document.querySelectorAll(".stat__num").forEach(function (numEl, i) {
        var target = parseInt(numEl.getAttribute("data-value"), 10) || 0;
        var proxy = { v: 0 };
        gsap.to(proxy, {
          v: target,
          duration: 0.9,
          delay: i * 0.08,
          ease: "power2.out",
          onUpdate: function () {
            numEl.textContent = Math.round(proxy.v).toLocaleString("en-US");
          }
        });
      });
    }
  });
})();
