(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const canHover = matchMedia("(hover:hover)").matches;
  const reduced = matchMedia("(prefers-reduced-motion:reduce)").matches;

  // Scroll progress
  const bar = $("#progressBar");
  addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.width = (max > 0 ? (scrollY / max) * 100 : 0) + "%";
  }, { passive: true });

  // Typing effect
  const typed = $("#typed");
  if (typed && !reduced) {
    const roles = ["IT Specialist | Cyber Security", "Web Developer", "Java Programming Instructor", "Content Creator"];
    let r = 0, i = 0, del = false;
    const tick = () => {
      const word = (window.TYPED_ROLES || roles)[r % (window.TYPED_ROLES || roles).length];
      typed.textContent = word.slice(0, i);
      if (!del && i === word.length) { del = true; return setTimeout(tick, 1800); }
      if (del && i === 0) { del = false; r = (r + 1) % (window.TYPED_ROLES || roles).length; }
      i += del ? -1 : 1;
      setTimeout(tick, del ? 35 : 75);
    };
    typed.textContent = ""; tick();
    addEventListener("langchange", () => { r = 0; i = 0; del = false; });
  }

  // Hero spotlight
  const hero = $(".hero");
  if (hero && canHover) hero.addEventListener("mousemove", e => {
    const b = hero.getBoundingClientRect();
    hero.style.setProperty("--hx", e.clientX - b.left + "px");
    hero.style.setProperty("--hy", e.clientY - b.top + "px");
  });

  // Tilt + spotlight
  if (canHover && !reduced) {
    $$(".project-card,.skill-card,.stat-card,.profile-card").forEach(el => {
      el.classList.add("tilt");
      el.addEventListener("mousemove", e => {
        const b = el.getBoundingClientRect();
        const x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height;
        const max = el.classList.contains("profile-card") ? 9 : 5;
        el.style.setProperty("--ry", ((x - .5) * max * 2).toFixed(2) + "deg");
        el.style.setProperty("--rx", ((.5 - y) * max * 2).toFixed(2) + "deg");
        el.style.setProperty("--mx", x * 100 + "%");
        el.style.setProperty("--my", y * 100 + "%");
      });
      el.addEventListener("mouseleave", () => { el.style.setProperty("--rx", "0deg"); el.style.setProperty("--ry", "0deg"); });
    });
  }

  // Animated counters
  const co = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    co.unobserve(en.target);
    const el = en.target, end = parseFloat(el.dataset.count), dec = +el.dataset.decimals || 0, suf = el.dataset.suffix || "";
    const t0 = performance.now();
    const step = t => {
      const p = Math.min((t - t0) / 1400, 1), v = end * (1 - Math.pow(1 - p, 3));
      el.textContent = v.toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: .6 });
  $$("[data-count]").forEach(el => co.observe(el));

  // Project filter
  const chips = $$(".chip"), cards = $$(".project-card");
  chips.forEach(c => c.addEventListener("click", () => {
    chips.forEach(x => x.classList.toggle("active", x === c));
    const f = c.dataset.filter;
    cards.forEach(card => {
      const show = f === "all" || card.dataset.cat === f;
      card.classList.toggle("is-hidden", !show);
      card.classList.remove("pop");
      if (show) { card.classList.add("visible"); void card.offsetWidth; card.classList.add("pop"); }
    });
  }));

  // Certificate lightbox
  const lb = $("#lightbox"), lbImg = $("img", lb);
  const closeLb = () => { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); };
  $$(".certificate-image-wrap img").forEach(img => img.addEventListener("click", () => {
    if (!img.closest(".has-image")) return;
    lbImg.src = img.src; lb.classList.add("open"); lb.setAttribute("aria-hidden", "false");
  }));
  lb.addEventListener("click", closeLb);

  // Keyboard: Esc closes, arrows drive certificate slider
  addEventListener("keydown", e => {
    if (e.key === "Escape") closeLb();
    const sec = $("#certificates").getBoundingClientRect();
    if (sec.top < innerHeight * .6 && sec.bottom > innerHeight * .4 && !lb.classList.contains("open")) {
      if (e.key === "ArrowRight") $(".certificate-next")?.click();
      if (e.key === "ArrowLeft") $(".certificate-prev")?.click();
    }
  });

  // Copy email + toast
  const toast = $("#toast");
  const show = msg => { toast.textContent = msg; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2200); };
  $("#copyEmail")?.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText("radenalexander14@gmail.com"); show(window.__lang === "id" ? "Email disalin ✓" : "Email copied ✓"); }
    catch { show("radenalexander14@gmail.com"); }
  });
})();
