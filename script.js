const header = document.getElementById("header");
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const backToTop = document.getElementById("backToTop");
const year = document.getElementById("year");

year.textContent = new Date().getFullYear();

// HEADER + BACK TO TOP
window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
  backToTop.classList.toggle("show", window.scrollY > 500);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// MOBILE NAVIGATION
menuToggle.addEventListener("click", () => {
  menuToggle.classList.toggle("active");
  navMenu.classList.toggle("open");
  document.body.classList.toggle("menu-open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.classList.remove("active");
    navMenu.classList.remove("open");
    document.body.classList.remove("menu-open");
  });
});

// DARK / LIGHT MODE
const savedTheme = localStorage.getItem("portfolio-theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
  themeIcon.textContent = "☀";
} else {
  themeIcon.textContent = "☾";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  const isDark = document.body.classList.contains("dark");
  themeIcon.textContent = isDark ? "☀" : "☾";

  localStorage.setItem("portfolio-theme", isDark ? "dark" : "light");
});

// SCROLL REVEAL
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});


// CERTIFICATE SLIDER
const certificateSlider = document.querySelector("[data-certificate-slider]");

if (certificateSlider) {
  const track = certificateSlider.querySelector(".certificate-track");
  const cards = Array.from(certificateSlider.querySelectorAll(".certificate-card"));
  const prevButton = certificateSlider.querySelector(".certificate-prev");
  const nextButton = certificateSlider.querySelector(".certificate-next");
  const dotsContainer = document.querySelector(".certificate-dots");
  let currentCertificate = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  cards.forEach((card, index) => {
    const image = card.querySelector("img");
    const imageWrap = card.querySelector(".certificate-image-wrap");

    image.addEventListener("load", () => {
      imageWrap.classList.add("has-image");
    });

    image.addEventListener("error", () => {
      imageWrap.classList.remove("has-image");
    });

    if (dotsContainer) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "certificate-dot";
      dot.setAttribute("aria-label", `Go to certificate ${index + 1}`);
      dot.addEventListener("click", () => {
        currentCertificate = index;
        updateCertificateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  });

  const updateCertificateSlider = () => {
    track.style.transform = `translateX(-${currentCertificate * 100}%)`;

    cards.forEach((card, index) => {
      card.classList.toggle("is-active", index === currentCertificate);
    });

    const dots = dotsContainer ? dotsContainer.querySelectorAll(".certificate-dot") : [];
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentCertificate);
    });

    prevButton.disabled = currentCertificate === 0;
    nextButton.disabled = currentCertificate === cards.length - 1;
  };

  prevButton.addEventListener("click", () => {
    if (currentCertificate > 0) {
      currentCertificate -= 1;
      updateCertificateSlider();
    }
  });

  nextButton.addEventListener("click", () => {
    if (currentCertificate < cards.length - 1) {
      currentCertificate += 1;
      updateCertificateSlider();
    }
  });

  const handleSwipe = () => {
    const distance = touchStartX - touchEndX;

    if (Math.abs(distance) < 45) return;

    if (distance > 0 && currentCertificate < cards.length - 1) {
      currentCertificate += 1;
    } else if (distance < 0 && currentCertificate > 0) {
      currentCertificate -= 1;
    }

    updateCertificateSlider();
  };

  track.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener("touchend", (event) => {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  updateCertificateSlider();
}

// ACTIVE NAVIGATION ITEM
const sections = document.querySelectorAll("main section[id]");

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        let activeId = entry.target.id;
        if (activeId === "interactive-labs") activeId = "projects";
        if (activeId === "certificates" || activeId === "education") activeId = "experience";

        navLinks.forEach((link) => {
          link.classList.remove("active");

          if (link.getAttribute("href") === `#${activeId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  {
    rootMargin: "-35% 0px -55% 0px",
  }
);

sections.forEach((section) => {
  sectionObserver.observe(section);
});
