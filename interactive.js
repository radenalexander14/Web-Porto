/* ==========================================================================
   INTERACTIVE ENGINE - RADEN ALEXANDER PORTFOLIO
   High-Tech Cyber Security & Developer Interactive Features
   ========================================================================== */

(() => {
  // ------------------------------------------------------------------------
  // 1. SILENT MOCK AUDIO (Audio Removed as Requested)
  // ------------------------------------------------------------------------
  const SoundFX = {
    click: () => {},
    hover: () => {},
    key: () => {},
    laser: () => {},
    success: () => {},
    scanBeep: () => {},
    isMuted: () => true,
    toggleMute: () => true
  };

  // ------------------------------------------------------------------------
  // 2. INTERACTIVE CANVAS BACKGROUND (Neural Constellation & Matrix Rain)
  // ------------------------------------------------------------------------
  const CanvasBackground = (() => {
    const canvas = document.getElementById("bgCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mode = localStorage.getItem("alexander-bg-fx") || "constellation"; // 'constellation', 'matrix', 'off'
    let mouse = { x: -1000, y: -1000 };
    let animId = null;

    // Constellation Particles
    const particles = [];
    const PARTICLE_COUNT = Math.min(Math.floor((width * height) / 14000), 75);

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;

        // Mouse attraction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          this.x += dx * 0.02;
          this.y += dy * 0.02;
        }
      }
      draw(isDark) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark ? "rgba(111, 140, 255, 0.6)" : "rgba(31, 87, 255, 0.4)";
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    // Matrix Rain
    const matrixChars = "01010101XYZABCDEF<>{}/*+=!@#$%";
    const fontSize = 14;
    let columns = Math.floor(width / fontSize);
    let drops = Array(columns).fill(1);

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.floor(width / fontSize);
      drops = Array(columns).fill(1);
    };
    window.addEventListener("resize", resize);

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    const loop = () => {
      if (mode === "off") {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      const isDark = document.body.classList.contains("dark");

      if (mode === "constellation") {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw(isDark);

          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              const alpha = (1 - dist / 120) * (isDark ? 0.22 : 0.15);
              ctx.strokeStyle = isDark ? `rgba(111, 140, 255, ${alpha})` : `rgba(31, 87, 255, ${alpha})`;
              ctx.lineWidth = 1;
              ctx.stroke();
            }
          }

          // Link to mouse
          const mdx = mouse.x - particles[i].x;
          const mdy = mouse.y - particles[i].y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = isDark ? `rgba(0, 242, 254, ${(1 - mdist / 140) * 0.35})` : `rgba(31, 87, 255, 0.25)`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      } else if (mode === "matrix") {
        ctx.fillStyle = isDark ? "rgba(9, 10, 15, 0.12)" : "rgba(244, 241, 234, 0.15)";
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = isDark ? "#00ff88" : "#1f57ff";
        ctx.font = `${fontSize}px monospace`;

        for (let i = 0; i < drops.length; i++) {
          const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return {
      setMode: (newMode) => {
        mode = newMode;
        localStorage.setItem("alexander-bg-fx", newMode);
        ctx.clearRect(0, 0, width, height);
      },
      getMode: () => mode,
      toggleMode: () => {
        const next = mode === "constellation" ? "matrix" : mode === "matrix" ? "off" : "constellation";
        CanvasBackground.setMode(next);
        return next;
      }
    };
  })();

  // ------------------------------------------------------------------------
  // 3. SMOOTH MAGNETIC CYBER CURSOR (Desktop Only)
  // ------------------------------------------------------------------------
  (() => {
    if (matchMedia("(hover: none)").matches) return;

    const dot = document.createElement("div");
    dot.className = "cyber-cursor-dot";
    const ring = document.createElement("div");
    ring.className = "cyber-cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.opacity = "1";
      ring.style.opacity = "1";
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    });

    const updateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      requestAnimationFrame(updateRing);
    };
    requestAnimationFrame(updateRing);

    window.addEventListener("mousedown", () => document.body.classList.add("cursor-active"));
    window.addEventListener("mouseup", () => document.body.classList.remove("cursor-active"));

    const addHoverListeners = () => {
      const clickables = document.querySelectorAll("a, button, input, select, textarea, .chip, .lab-tab-btn, .project-card, .term-chip, .contact-item");
      clickables.forEach((el) => {
        el.addEventListener("mouseenter", () => {
          document.body.classList.add("cursor-hover");
          SoundFX.hover();
        });
        el.addEventListener("mouseleave", () => {
          document.body.classList.remove("cursor-hover");
        });
      });
    };
    addHoverListeners();
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });
  })();

  // ------------------------------------------------------------------------
  // 4. CYBER SECURITY TERMINAL HUD (Interactive Command Shell)
  // ------------------------------------------------------------------------
  const CyberTerminal = (() => {
    const modal = document.getElementById("terminalModal");
    const output = document.getElementById("terminalOutput");
    const input = document.getElementById("terminalInput");
    const closeBtn = document.getElementById("terminalCloseBtn");
    const minBtn = document.getElementById("terminalMinBtn");
    const maxBtn = document.getElementById("terminalMaxBtn");
    const chips = document.querySelectorAll(".term-chip");

    if (!modal || !output || !input) return;

    let history = [];
    let historyIndex = -1;

    const printLine = (text, type = "") => {
      const line = document.createElement("div");
      line.className = `term-line term-output ${type}`;
      line.textContent = text;
      output.appendChild(line);
      output.scrollTop = output.scrollHeight;
    };

    const clearScreen = () => {
      output.innerHTML = "";
      printLine("Alexander Cyber Core Shell [Version 2.4.0-release]", "accent");
      printLine("Type 'help' for available commands or tap the quick pills above.\n", "success");
    };

    const execute = (cmdStr) => {
      const trimmed = cmdStr.trim();
      if (!trimmed) return;

      SoundFX.click();

      // Print command prompt line
      const cmdLine = document.createElement("div");
      cmdLine.className = "term-line";
      cmdLine.innerHTML = `<span class="term-prompt">alexander@sec-core:~$</span> ${escapeHTML(trimmed)}`;
      output.appendChild(cmdLine);

      history.push(trimmed);
      historyIndex = history.length;

      const [cmd, ...args] = trimmed.toLowerCase().split(" ");

      switch (cmd) {
        case "help":
          printLine(
            "Available Commands:\n" +
            "  whoami       - Display identity and academic summary\n" +
            "  skills       - Show categorized security & developer skill matrix\n" +
            "  projects     - List active research & software projects\n" +
            "  scan         - Launch simulated Nmap cyber vulnerability scanner\n" +
            "  matrix       - Toggle cyberpunk Matrix rain background\n" +
            "  theme        - Toggle dark / light color scheme\n" +
            "  decrypt      - Run interactive decryption cipher challenge\n" +
            "  contact      - Display direct contact channels\n" +
            "  sudo hire    - [ROOT] Execute hiring verification challenge\n" +
            "  clear        - Clear console screen buffer\n" +
            "  exit         - Close terminal session"
          );
          break;

        case "whoami":
          printLine(
            "==========================================================\n" +
            "IDENTITY: Raden Alexander Christianace Deventa Willy Putra\n" +
            "ROLE    : IT Specialist | Cyber Security & Software Engineer\n" +
            "ACADEMY : Bina Nusantara University (Computer Science - Cyber Security)\n" +
            "GPA     : 3.22 / 4.00\n" +
            "LOCATION: Jakarta / Bandung / Yogyakarta, Indonesia\n" +
            "FOCUS   : Web Dev, Penetration Testing, Nmap, Java, AI NLP\n" +
            "==========================================================",
            "success"
          );
          break;

        case "skills":
          printLine(
            "[SECURITY]   : Nmap, Linux, Vulnerability Assessment, Network Recon\n" +
            "[WEB & DEV]  : HTML5, CSS3, Modern JS, PHP, Laravel, MySQL, Vite\n" +
            "[LANGUAGES]  : Java (OOP & GUI), Python (PyTorch, FastAPI), Bash\n" +
            "[CREATIVE]   : Drone Cinematography, Studio Photography, UI/UX\n" +
            "[LEADERSHIP] : BNCC Java Instructor, KMK Logistics Vice Head, ISACA",
            "accent"
          );
          break;

        case "projects":
          printLine(
            "PROJECT PORTFOLIO INDEX:\n" +
            "  01 [AI]       Indonesia <-> Banjar Neural Translator (PyTorch/OCR)\n" +
            "  02 [SECURITY] Information Gathering Automation (Nmap/AI Agent)\n" +
            "  03 [RESEARCH] Healthcare Website Accessibility (WCAG 2.1 Level AA)\n" +
            "  04 [WEB]      Laravel Mining & Store Management Application\n" +
            "Run 'scan' to inspect security posture or explore the site interactive labs!",
            "accent"
          );
          break;

        case "scan":
          printLine("[*] Initializing Nmap 7.94 automated cyber scan...", "warning");
          SoundFX.scanBeep();
          setTimeout(() => {
            printLine("[+] Target: local-defense.alexander.net (192.168.1.100)", "warning");
          }, 300);
          setTimeout(() => {
            printLine("[+] SYN Stealth Scan launched on 1,000 common ports...", "accent");
          }, 700);
          setTimeout(() => {
            printLine(
              "PORT      STATE  SERVICE       VERSION\n" +
              "22/tcp    open   ssh           OpenSSH 9.3p1 (Hardened)\n" +
              "80/tcp    open   http          nginx 1.25 (SSL Enforced)\n" +
              "443/tcp   open   https         TLS 1.3 Strict-Transport-Security\n" +
              "3306/tcp  closed mysql         Filtered by firewall iptables\n" +
              "8080/tcp  open   http-proxy    FastAPI AI Microservice v2.4\n" +
              "\n[*] Vulnerability Assessment: 0 CRITICAL | 0 HIGH\n" +
              "[*] Defense Posture: SECURE / REINFORCED",
              "success"
            );
            SoundFX.success();
          }, 1400);
          break;

        case "matrix":
          const m = CanvasBackground.setMode("matrix");
          printLine("[✓] Matrix digital rain sequence engaged.", "success");
          break;

        case "theme":
          document.getElementById("themeToggle")?.click();
          printLine("[✓] UI theme toggled successfully.", "success");
          break;

        case "decrypt":
          printLine("[*] Decryption Cipher Challenge Initiated:", "warning");
          printLine("ENCRYPTED CIPHER: 'UlVsTllTQlFWVWREVkVsVUlFNUpTMFZUUlZNPQ=='", "warning");
          setTimeout(() => {
            printLine("ANALYSIS: Multi-layer Base64 hash detected.", "accent");
            printLine("DECRYPTING...", "warning");
          }, 400);
          setTimeout(() => {
            printLine("DECRYPTED RESULT: 'READY FOR CYBER SECURITY CHALLENGES 2026'", "success");
            printLine("[★] Secret achievement unlocked: Master Cryptanalyst!", "accent");
            triggerConfetti();
            SoundFX.success();
          }, 1100);
          break;

        case "contact":
          printLine(
            "DIRECT COMMUNICATION CHANNELS:\n" +
            "  Email    : radenalexander14@gmail.com\n" +
            "  LinkedIn : https://www.linkedin.com/in/radenalexander/\n" +
            "  GitHub   : https://github.com/radenalexander14\n" +
            "  Instagram: @christian.alxnd",
            "accent"
          );
          break;

        case "sudo":
          if (args[0] === "hire") {
            printLine("[ROOT AUTHENTICATED] EXECUTING RECRUITMENT PROTOCOL...", "warning");
            setTimeout(() => {
              printLine("=======================================================", "success");
              printLine("  ACCESS GRANTED: YOU HIRED ALEXANDER! EXCELLENT CHOICE!", "success");
              printLine("  Prepared to deliver high-quality cybersecurity & software.", "success");
              printLine("=======================================================", "success");
              triggerConfetti();
              SoundFX.success();
            }, 500);
          } else {
            printLine(`sudo: ${args.join(" ") || "command"}: authorization granted for user alexander.`, "accent");
          }
          break;

        case "clear":
          clearScreen();
          break;

        case "exit":
          CyberTerminal.close();
          break;

        default:
          printLine(`bash: command not found: ${cmd}. Type 'help' for available commands.`, "error");
          break;
      }

      input.value = "";
      output.scrollTop = output.scrollHeight;
    };

    // Quick Chips click
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const cmd = chip.dataset.cmd;
        if (cmd) execute(cmd);
      });
    });

    // Input Enter handler
    input.addEventListener("keydown", (e) => {
      SoundFX.key();
      if (e.key === "Enter") {
        execute(input.value);
      } else if (e.key === "ArrowUp") {
        if (historyIndex > 0) {
          historyIndex--;
          input.value = history[historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        if (historyIndex < history.length - 1) {
          historyIndex++;
          input.value = history[historyIndex] || "";
        } else {
          historyIndex = history.length;
          input.value = "";
        }
      }
    });

    closeBtn?.addEventListener("click", () => CyberTerminal.close());
    minBtn?.addEventListener("click", () => CyberTerminal.close());
    maxBtn?.addEventListener("click", () => {
      const win = modal.querySelector(".terminal-window");
      win.classList.toggle("fullscreen");
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) CyberTerminal.close();
    });

    const openTerminal = () => {
      modal.classList.add("open");
      SoundFX.laser();
      setTimeout(() => input.focus(), 150);
    };

    return {
      open: openTerminal,
      close: () => {
        modal.classList.remove("open");
        SoundFX.click();
      },
      execute
    };
  })();

  // ------------------------------------------------------------------------
  // 5. COMMAND PALETTE (Ctrl + K / Quick Action HUD)
  // ------------------------------------------------------------------------
  const CommandPalette = (() => {
    const modal = document.getElementById("cmdPaletteModal");
    const input = document.getElementById("cmdInput");
    const list = document.getElementById("cmdList");
    const closeBtn = document.getElementById("cmdCloseBtn");

    if (!modal || !input || !list) return;

    const items = [
      { id: "home", title: "Go to Home", category: "Navigation", icon: "🏠", action: () => scrollToSection("home") },
      { id: "about", title: "About Alexander", category: "Navigation", icon: "👤", action: () => scrollToSection("about") },
      { id: "skills", title: "Skills & Tech Stack", category: "Navigation", icon: "⚡", action: () => scrollToSection("skills") },
      { id: "projects", title: "Selected Projects", category: "Navigation", icon: "🚀", action: () => scrollToSection("projects") },
      { id: "interactive-labs", title: "Interactive Labs & Demos", category: "Navigation", icon: "🧪", action: () => scrollToSection("interactive-labs") },
      { id: "certificates", title: "Verified Certificates", category: "Navigation", icon: "📜", action: () => scrollToSection("certificates") },
      { id: "experience", title: "Work & Leadership Experience", category: "Navigation", icon: "💼", action: () => scrollToSection("experience") },
      { id: "contact", title: "Contact & Collaboration", category: "Navigation", icon: "✉️", action: () => scrollToSection("contact") },
      { id: "terminal", title: "Launch Cyber Terminal", category: "Interactive", icon: "💻", action: () => CyberTerminal.open() },
      { id: "theme", title: "Toggle Dark / Light Theme", category: "Appearance", icon: "🌓", action: () => document.getElementById("themeToggle")?.click() },
      { id: "bg-fx", title: "Cycle Background Canvas FX", category: "Appearance", icon: "✨", action: () => toggleCanvasFX() },
      { id: "copy-email", title: "Copy Email Address", category: "Contact", icon: "📋", action: () => document.getElementById("copyEmail")?.click() }
    ];

    let selectedIndex = 0;

    const renderList = (filter = "") => {
      list.innerHTML = "";
      const filtered = items.filter((item) =>
        item.title.toLowerCase().includes(filter.toLowerCase()) ||
        item.category.toLowerCase().includes(filter.toLowerCase())
      );

      if (filtered.length === 0) {
        list.innerHTML = `<li style="padding: 24px; text-align: center; color: var(--muted)">No actions matching "${escapeHTML(filter)}"</li>`;
        return;
      }

      let currentCat = "";
      filtered.forEach((item, index) => {
        if (item.category !== currentCat) {
          currentCat = item.category;
          const catHeading = document.createElement("li");
          catHeading.className = "cmd-category-title";
          catHeading.textContent = currentCat;
          list.appendChild(catHeading);
        }

        const li = document.createElement("li");
        li.className = `cmd-item ${index === selectedIndex ? "selected" : ""}`;
        li.innerHTML = `
          <div class="cmd-item-left">
            <span class="cmd-item-icon">${item.icon}</span>
            <span>${escapeHTML(item.title)}</span>
          </div>
          <span class="cmd-item-badge">${item.category}</span>
        `;

        li.addEventListener("click", () => {
          SoundFX.click();
          closePalette();
          item.action();
        });

        list.appendChild(li);
      });
    };

    const openPalette = () => {
      modal.classList.add("open");
      selectedIndex = 0;
      input.value = "";
      renderList();
      SoundFX.laser();
      setTimeout(() => input.focus(), 100);
    };

    const closePalette = () => {
      modal.classList.remove("open");
    };

    input.addEventListener("input", () => {
      selectedIndex = 0;
      renderList(input.value);
    });

    input.addEventListener("keydown", (e) => {
      const itemsEls = list.querySelectorAll(".cmd-item");
      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % itemsEls.length;
        updateSelected(itemsEls);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + itemsEls.length) % itemsEls.length;
        updateSelected(itemsEls);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const active = itemsEls[selectedIndex];
        if (active) active.click();
      } else if (e.key === "Escape") {
        closePalette();
      }
    });

    const updateSelected = (itemsEls) => {
      itemsEls.forEach((el, i) => el.classList.toggle("selected", i === selectedIndex));
      SoundFX.hover();
    };

    closeBtn?.addEventListener("click", closePalette);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closePalette();
    });

    window.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (modal.classList.contains("open")) closePalette();
        else openPalette();
      }
    });

    return { open: openPalette, close: closePalette };
  })();

  // ------------------------------------------------------------------------
  // 6. LIVE AI TRANSLATOR SIMULATOR (Indonesia <-> Banjar Neural Model)
  // ------------------------------------------------------------------------
  const AITranslator = (() => {
    const inputArea = document.getElementById("aiInputText");
    const outputArea = document.getElementById("aiOutputText");
    const translateBtn = document.getElementById("aiTranslateBtn");
    const presetChips = document.querySelectorAll(".ai-preset-chip");
    const confidenceVal = document.getElementById("aiConfidenceVal");
    const latencyVal = document.getElementById("aiLatencyVal");

    if (!inputArea || !outputArea || !translateBtn) return;

    // Indonesian to Banjar Dictionary & Phrase map
    const dictionary = {
      "halo, apa kabar?": "Halo, kaya apa habar?",
      "terima kasih banyak": "Tarima kasih banyak",
      "selamat pagi": "Salamat baisukan",
      "selamat malam": "Salamat malam",
      "saya sedang belajar pemrograman": "Ulun lagi balajar pamrograman",
      "saya mahasiswa ilmu komputer": "Ulun mahasiswa ilmu komputer",
      "makan bersama teman-teman": "Makan baimbai lawan kakawalan",
      "sampai jumpa lagi": "Kena batamuan pulang",
      "halo": "halo",
      "apa": "apa",
      "kabar": "habar",
      "saya": "ulun",
      "aku": "ulun / aku",
      "kamu": "pian / nyawa",
      "anda": "pian",
      "mereka": "buhan nya",
      "sedang": "lagi",
      "belajar": "balajar",
      "makan": "makan",
      "tidur": "guring",
      "pergi": "tulak",
      "datang": "datang",
      "rumah": "wadah / rumah",
      "teman": "kawal",
      "teman-teman": "kakawalan",
      "terima": "tarima",
      "kasih": "kasih",
      "banyak": "banyak",
      "sangat": "bana / tapi",
      "bagus": "bungas / mantap",
      "cantik": "bungas",
      "selamat": "salamat",
      "pagi": "baisukan",
      "siang": "tangah hari",
      "sore": "kamarian",
      "malam": "malam",
      "tidak": "kada",
      "bisa": "kawa",
      "mau": "handak",
      "sudah": "tuntung / sudah",
      "belum": "baluman",
      "kenapa": "kanapa",
      "di mana": "di mana",
      "bagaimana": "kaya apa"
    };

    const translate = () => {
      const raw = inputArea.value.trim();
      if (!raw) {
        outputArea.textContent = "";
        return;
      }

      SoundFX.click();
      outputArea.textContent = "⚡ Running Transformer inference...";
      translateBtn.disabled = true;

      const lower = raw.toLowerCase();
      let result = "";

      // Exact phrase match first
      if (dictionary[lower]) {
        result = dictionary[lower];
      } else {
        // Tokenizer word-by-word
        const words = raw.split(/\s+/);
        const translatedWords = words.map((w) => {
          const clean = w.toLowerCase().replace(/[.,!?;:]/g, "");
          const punct = w.match(/[.,!?;:]$/) ? w.slice(-1) : "";
          if (dictionary[clean]) {
            return dictionary[clean] + punct;
          }
          return w;
        });
        result = translatedWords.join(" ");
      }

      const randomLatency = Math.floor(Math.random() * 15) + 18; // 18-32ms
      const randomConfidence = (Math.random() * 2.5 + 97.2).toFixed(1); // 97.2 - 99.7%

      setTimeout(() => {
        outputArea.textContent = result;
        if (confidenceVal) confidenceVal.textContent = `${randomConfidence}%`;
        if (latencyVal) latencyVal.textContent = `${randomLatency}ms`;
        translateBtn.disabled = false;
        SoundFX.success();
      }, 350);
    };

    translateBtn.addEventListener("click", translate);

    presetChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        inputArea.value = chip.dataset.text || chip.textContent;
        SoundFX.click();
        translate();
      });
    });

    return { translate };
  })();

  // ------------------------------------------------------------------------
  // 7. CYBER SECURITY LAB (Entropy Analyzer & Port Scanner)
  // ------------------------------------------------------------------------
  const CyberLab = (() => {
    // 7A: Password Entropy & Threat Analyzer
    const pwdInput = document.getElementById("entropyInput");
    const meterBar = document.getElementById("entropyBar");
    const entropyBits = document.getElementById("entropyBits");
    const crackTime = document.getElementById("crackTime");
    const ratingLabel = document.getElementById("entropyRating");

    const calculateEntropy = (str) => {
      if (!str) return 0;
      let pool = 0;
      if (/[a-z]/.test(str)) pool += 26;
      if (/[A-Z]/.test(str)) pool += 26;
      if (/[0-9]/.test(str)) pool += 10;
      if (/[^a-zA-Z0-9]/.test(str)) pool += 33;
      return pool > 0 ? str.length * Math.log2(pool) : 0;
    };

    const estimateCrackTime = (bits) => {
      if (bits === 0) return "0 seconds";
      if (bits < 28) return "Instant (< 1 ms)";
      if (bits < 36) return "A few seconds";
      if (bits < 48) return "A few hours";
      if (bits < 60) return "Several months";
      if (bits < 75) return "Over 80 years";
      if (bits < 90) return "10,000+ years";
      return "Trillions of years (Quantum-Resistant)";
    };

    if (pwdInput && meterBar) {
      pwdInput.addEventListener("input", () => {
        const val = pwdInput.value;
        const bits = Math.round(calculateEntropy(val));

        if (entropyBits) entropyBits.textContent = `${bits} bits`;
        if (crackTime) crackTime.textContent = estimateCrackTime(bits);

        const pct = Math.min((bits / 90) * 100, 100);
        meterBar.style.width = `${pct}%`;

        let color = "var(--neon-red)";
        let rating = "Critical / Very Weak";

        if (bits >= 75) {
          color = "var(--neon-green)";
          rating = "Hardened / Military-Grade Shield";
        } else if (bits >= 55) {
          color = "var(--neon-cyan)";
          rating = "Strong & Resilient";
        } else if (bits >= 36) {
          color = "var(--neon-amber)";
          rating = "Moderate / Vulnerable to Dictionary Attack";
        }

        meterBar.style.background = color;
        if (ratingLabel) {
          ratingLabel.textContent = rating;
          ratingLabel.style.color = color;
        }
      });
    }

    // 7B: Simulated Nmap Recon Port Scanner
    const targetSelect = document.getElementById("scanTargetSelect");
    const startScanBtn = document.getElementById("startScanBtn");
    const scanLog = document.getElementById("scannerLog");

    if (startScanBtn && scanLog) {
      startScanBtn.addEventListener("click", () => {
        const target = targetSelect ? targetSelect.value : "192.168.1.10";
        startScanBtn.disabled = true;
        SoundFX.scanBeep();

        scanLog.innerHTML = `<span style="color:var(--neon-cyan)">[>] Starting Nmap 7.94 scan on ${target}...</span>\n`;

        setTimeout(() => {
          scanLog.innerHTML += `<span>[+] Probing host status (ICMP Echo + TCP SYN)... Host is UP (0.0021s latency).</span>\n`;
          SoundFX.scanBeep();
        }, 400);

        setTimeout(() => {
          scanLog.innerHTML += `<span>[+] Scanning 1000 ports via stealth SYN algorithm...</span>\n`;
        }, 800);

        setTimeout(() => {
          scanLog.innerHTML += `<span style="color:var(--neon-green)">
PORT     STATE SERVICE        VERSION
21/tcp   open  ftp            vsftpd 3.0.3 (Anon disabled)
22/tcp   open  ssh            OpenSSH 9.3 (Key-auth only)
80/tcp   open  http           Apache/2.4.58 (Ubuntu)
443/tcp  open  ssl/https      TLS 1.3 Certified
3306/tcp open  mysql          MySQL 8.0.36 (Secured)
8080/tcp open  http-alt       FastAPI Microservice
</span>\n`;
          scanLog.innerHTML += `<span style="color:var(--neon-cyan)">[✓] Nmap done: 1 IP address (1 host up) scanned in 1.48 seconds.</span>`;
          scanLog.scrollTop = scanLog.scrollHeight;
          startScanBtn.disabled = false;
          SoundFX.success();
        }, 1400);
      });
    }
  })();

  // ------------------------------------------------------------------------
  // 8. INTERACTIVE JAVA OOP CODE RUNNER (BNCC Instructor Specialty)
  // ------------------------------------------------------------------------
  const JavaRunner = (() => {
    const codeInput = document.getElementById("javaCodeInput");
    const lineNumbers = document.getElementById("javaLineNumbers");
    const consoleOutput = document.getElementById("javaConsoleOutput");
    const runBtn = document.getElementById("runJavaBtn");
    const resetBtn = document.getElementById("resetJavaBtn");
    const clearBtn = document.getElementById("clearConsoleBtn");
    const snippetBtns = document.querySelectorAll(".java-btn-pill");

    if (!codeInput || !consoleOutput || !runBtn) return;

    const snippets = {
      oop: {
        code: `// Java OOP: Inheritance & Polymorphism
abstract class SecurityService {
    protected String serviceName;
    public SecurityService(String name) { this.serviceName = name; }
    public abstract void auditSecurity();
}

class WebFirewall extends SecurityService {
    public WebFirewall() { super("Cloudflare WAF"); }
    @Override
    public void auditSecurity() {
        System.out.println("[*] " + serviceName + ": Inspecting HTTP packets...");
        System.out.println("[✓] Zero SQL Injection or XSS threats detected.");
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println("BNCC Java Program Execution:");
        SecurityService waf = new WebFirewall();
        waf.auditSecurity();
    }
}`
      },
      hash: {
        code: `// Java Security: SHA-256 Hashing Stream
import java.security.MessageDigest;

public class SecurityHasher {
    public static void main(String[] args) throws Exception {
        String data = "Alexander_CyberSecurity_2026";
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        byte[] hash = md.digest(data.getBytes());
        
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) hexString.append(String.format("%02x", b));
        
        System.out.println("Original Payload: " + data);
        System.out.println("SHA-256 Hash    : " + hexString.toString());
        System.out.println("Integrity Status: VERIFIED OK");
    }
}`
      },
      tree: {
        code: `// Java Data Structures: Binary Search Tree
class Node {
    int key;
    Node left, right;
    public Node(int item) { key = item; }
}

public class BSTSearch {
    public static void main(String[] args) {
        System.out.println("[+] Initializing Binary Search Tree indices...");
        int[] keys = {50, 30, 20, 40, 70, 60, 80};
        System.out.println("[+] Searching key 70 in O(log n) time...");
        System.out.println("[✓] Key 70 found at Depth Level: 2.");
    }
}`
      },
      custom: {
        code: `// Tulis atau edit kode Java Anda sendiri di sini!
public class Main {
    public static void main(String[] args) {
        System.out.println("Halo dari Java Playground!");
        
        int x = 15;
        int y = 25;
        int total = x + y;
        System.out.println("Hasil perhitungan: " + x + " + " + y + " = " + total);
        
        for (int i = 1; i <= 3; i++) {
            System.out.println("Iterasi loop ke-" + i);
        }
    }
}`
      }
    };

    let currentSnippet = "oop";

    // Synchronize Line Numbers
    const updateLineNumbers = () => {
      if (!lineNumbers || !codeInput) return;
      const count = codeInput.value.split("\n").length;
      let nums = [];
      for (let i = 1; i <= count; i++) {
        nums.push(i);
      }
      lineNumbers.textContent = nums.join("\n");
      lineNumbers.scrollTop = codeInput.scrollTop;
    };

    codeInput.addEventListener("input", updateLineNumbers);
    codeInput.addEventListener("scroll", () => {
      if (lineNumbers) lineNumbers.scrollTop = codeInput.scrollTop;
    });

    // Support Tab key indentation in editor
    codeInput.addEventListener("keydown", (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = codeInput.selectionStart;
        const end = codeInput.selectionEnd;
        const value = codeInput.value;
        codeInput.value = value.substring(0, start) + "    " + value.substring(end);
        codeInput.selectionStart = codeInput.selectionEnd = start + 4;
        updateLineNumbers();
      }
    });

    // Preset selector buttons
    snippetBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        snippetBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentSnippet = btn.dataset.snippet || "oop";
        if (snippets[currentSnippet]) {
          codeInput.value = snippets[currentSnippet].code;
          updateLineNumbers();
        }
        consoleOutput.textContent = "// Click '▶ Run Java Code' to compile and execute.";
      });
    });

    // Reset button
    resetBtn?.addEventListener("click", () => {
      if (snippets[currentSnippet]) {
        codeInput.value = snippets[currentSnippet].code;
        updateLineNumbers();
        consoleOutput.textContent = "// Code reset. Click '▶ Run Java Code' to execute.";
      }
    });

    // Clear console button
    clearBtn?.addEventListener("click", () => {
      consoleOutput.textContent = "// Console cleared.";
    });

    // Smart In-Browser Java Execution Engine
    const executeJava = (source) => {
      // 1. Check known presets
      if (source.includes("Cloudflare WAF") && source.includes("SecurityService")) {
        return `BNCC Java Program Execution:\n[*] Cloudflare WAF: Inspecting HTTP packets...\n[✓] Zero SQL Injection or XSS threats detected.\nProcess finished with exit code 0.`;
      }
      if (source.includes("SecurityHasher") && source.includes("MessageDigest")) {
        return `Original Payload: Alexander_CyberSecurity_2026\nSHA-256 Hash    : 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08\nIntegrity Status: VERIFIED OK\nProcess finished with exit code 0.`;
      }
      if (source.includes("BSTSearch") && source.includes("Binary Search Tree")) {
        return `[+] Initializing Binary Search Tree indices...\n[+] Searching key 70 in O(log n) time...\n[✓] Key 70 found at Depth Level: 2.\nProcess finished with exit code 0.`;
      }

      // 2. Syntax validation
      const openBraces = (source.match(/\{/g) || []).length;
      const closeBraces = (source.match(/\}/g) || []).length;
      if (openBraces !== closeBraces) {
        return `Main.java: error: reached end of file while parsing (unmatched braces: ${openBraces} '{' vs ${closeBraces} '}')\n1 error\nProcess finished with exit code 1.`;
      }

      const quotes = source.match(/"/g) || [];
      if (quotes.length % 2 !== 0) {
        return `Main.java: error: unclosed string literal\n1 error\nProcess finished with exit code 1.`;
      }

      // 3. Execution parser
      const lines = source.split("\n");
      const out = [];
      const env = {};

      const evalExpr = (expr) => {
        expr = expr.trim();
        if (/^"([^"]*)"$/.test(expr)) return expr.slice(1, -1);
        let s = expr;
        for (const [k, v] of Object.entries(env)) {
          const re = new RegExp(`\\b${k}\\b`, "g");
          s = s.replace(re, typeof v === "string" ? JSON.stringify(v) : v);
        }
        try {
          const fn = new Function(`return (${s});`);
          return fn();
        } catch (e) {
          return expr.replace(/"/g, "");
        }
      };

      const execStmt = (stmt) => {
        stmt = stmt.trim();
        if (!stmt) return;

        // var decl: int x = 10;
        const vDecl = stmt.match(/^(int|double|float|String|boolean|long)\s+([a-zA-Z_]\w*)\s*=\s*(.+)$/);
        if (vDecl) {
          env[vDecl[2]] = evalExpr(vDecl[3]);
          return;
        }

        // var assign: x = 20;
        const vAssign = stmt.match(/^([a-zA-Z_]\w*)\s*=\s*(.+)$/);
        if (vAssign && env.hasOwnProperty(vAssign[1])) {
          env[vAssign[1]] = evalExpr(vAssign[2]);
          return;
        }

        // System.out.println(...)
        const pLn = stmt.match(/^System\.out\.println\s*\((.*)\)$/);
        if (pLn) {
          out.push(String(evalExpr(pLn[1])));
          return;
        }

        // System.out.print(...)
        const pNoLn = stmt.match(/^System\.out\.print\s*\((.*)\)$/);
        if (pNoLn) {
          const v = String(evalExpr(pNoLn[1]));
          if (out.length > 0) out[out.length - 1] += v;
          else out.push(v);
          return;
        }
      };

      let idx = 0;
      while (idx < lines.length) {
        let line = lines[idx].trim();
        idx++;

        if (!line || line.startsWith("//") || line.startsWith("/*") || line.startsWith("*") || line.startsWith("package ") || line.startsWith("import ")) continue;
        if (line.startsWith("public class ") || line.startsWith("class ") || line.startsWith("public static void main") || line === "{" || line === "}") continue;

        // For loop: for (int i = 0; i < 5; i++)
        const forMatch = line.match(/^for\s*\(\s*int\s+([a-zA-Z_]\w*)\s*=\s*(\d+)\s*;\s*\1\s*(<|<=|>|>=)\s*(\d+)\s*;\s*\1(\+\+|\+=1)\s*\)\s*\{?$/);
        if (forMatch) {
          const [, loopVar, sVal, op, eVal] = forMatch;
          const body = [];
          while (idx < lines.length) {
            let bLine = lines[idx].trim();
            idx++;
            if (bLine === "}") break;
            body.push(bLine);
          }
          const start = parseInt(sVal, 10);
          const end = parseInt(eVal, 10);
          let count = 0;
          for (let iter = start; (op === "<" ? iter < end : iter <= end) && count < 50; iter++, count++) {
            env[loopVar] = iter;
            body.forEach(b => execStmt(b.replace(/;$/, "")));
          }
          continue;
        }

        // If condition: if (...) { ... }
        const ifMatch = line.match(/^if\s*\((.*)\)\s*\{?$/);
        if (ifMatch) {
          let condOk = false;
          try { condOk = Boolean(evalExpr(ifMatch[1])); } catch (e) {}
          const ifBody = [];
          while (idx < lines.length) {
            let bLine = lines[idx].trim();
            idx++;
            if (bLine === "}") break;
            ifBody.push(bLine);
          }
          if (condOk) {
            ifBody.forEach(b => execStmt(b.replace(/;$/, "")));
          }
          continue;
        }

        if (line.endsWith(";")) {
          execStmt(line.slice(0, -1));
        } else if (line.includes("System.out.print")) {
          return `Main.java:${idx}: error: ';' expected\n    ${line}\n    ^\n1 error\nProcess finished with exit code 1.`;
        }
      }

      if (out.length === 0) {
        out.push("Program executed successfully (no console output produced).");
      }
      out.push("Process finished with exit code 0.");
      return out.join("\n");
    };

    // Run Button Click Handler
    runBtn.addEventListener("click", () => {
      runBtn.disabled = true;
      const code = codeInput.value;
      consoleOutput.innerHTML = `<span style="color:#64748b">Compiling Main.java with javac (OpenJDK 21.0.2)...\nRunning JVM...</span>\n`;

      const startTime = performance.now();
      setTimeout(() => {
        const result = executeJava(code);
        const duration = Math.round(performance.now() - startTime);
        const isError = result.includes("error:");

        consoleOutput.innerHTML = `<span style="color:${isError ? "var(--neon-red)" : "var(--neon-green)"}">${escapeHTML(result)}</span>\n<span style="color:#64748b; font-size:0.75rem;">// Execution time: ${duration}ms</span>`;
        runBtn.disabled = false;
      }, 400);
    });

    // Initialize line numbers
    updateLineNumbers();
  })();

  // ------------------------------------------------------------------------
  // 8B. INTERACTIVE PROFILE PHOTO & CYBER HUD ENGINE
  // ------------------------------------------------------------------------
  (() => {
    const photoWrap = document.getElementById("profilePhotoWrap");
    const photoImg = document.getElementById("profileImg");
    const laserLine = document.getElementById("laserScanLine");
    const toast = document.getElementById("toast");

    if (!photoWrap || !photoImg) return;

    const showToastMsg = (msg) => {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 2400);
    };

    const triggerScan = () => {
      if (laserLine) {
        laserLine.classList.remove("scanning");
        void laserLine.offsetWidth;
        laserLine.classList.add("scanning");
      }
    };

    // Direct click on photo triggers biometric scan
    photoWrap.addEventListener("click", () => {
      triggerScan();
      showToastMsg(window.__lang === "id" ? "Biometrik Terverifikasi: Raden Alexander (100% Cocok) ✓" : "Biometric Scan: Verified 100% (Raden Alexander) ✓");
    });

    // Interactive floating tags click
    document.querySelectorAll(".floating-tag").forEach((tag) => {
      tag.addEventListener("click", () => {
        const info = tag.dataset.info || tag.textContent;
        showToastMsg(`[${tag.querySelector("span")?.textContent || "Tag"}] ${info}`);
      });
    });
  })();

  // ------------------------------------------------------------------------
  // 9. INTERACTIVE LAB TABS SWITCHER
  // ------------------------------------------------------------------------
  (() => {
    const tabBtns = document.querySelectorAll(".lab-tab-btn");
    const panels = document.querySelectorAll(".lab-panel");

    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        SoundFX.click();
        tabBtns.forEach((b) => b.classList.remove("active"));
        panels.forEach((p) => p.classList.remove("active"));

        btn.classList.add("active");
        const targetId = btn.dataset.panel;
        const targetPanel = document.getElementById(targetId);
        if (targetPanel) targetPanel.classList.add("active");
      });
    });
  })();

  // ------------------------------------------------------------------------
  // 10. PROJECT QUICK-VIEW MODAL DRAWER
  // ------------------------------------------------------------------------
  const ProjectModal = (() => {
    const modal = document.getElementById("projectDetailModal");
    const titleEl = document.getElementById("projModalTitle");
    const descEl = document.getElementById("projModalDesc");
    const stackEl = document.getElementById("projModalStack");
    const archEl = document.getElementById("projModalArch");
    const closeBtn = document.getElementById("projModalClose");

    if (!modal) return;

    const projectData = {
      "01": {
        title: "Indonesia ↔ Banjar AI Translator",
        category: "Artificial Intelligence & NLP",
        desc: "Neural Machine Translation application designed to bridge Indonesian national language and regional Banjar language. Integrated with optical character recognition (OCR) and FastAPI server.",
        arch: "User Input / Document OCR -> Tokenizer -> PyTorch Transformer Encoder-Decoder -> Beam Search Decoder -> FastAPI Microservice -> React Web Client",
        stack: ["Python", "PyTorch", "Transformer", "FastAPI", "React", "Tesseract OCR"]
      },
      "02": {
        title: "Information Gathering Automation",
        category: "Cyber Security & Reconnaissance",
        desc: "Framework that automates preliminary security audits. Orchestrates Nmap network discovery, queries live CVE vulnerability databases, and synthesizes findings using AI reasoning.",
        arch: "Target Definition -> Asynchronous Nmap SYN Port Scanner -> Banner Grabbing -> CVE VulnDB Query -> Risk Score Matrix Generator",
        stack: ["Python", "Nmap", "Bash", "CVE Database", "AI Agent", "Linux"]
      },
      "03": {
        title: "Healthcare Website Accessibility Research",
        category: "Software Quality & Accessibility",
        desc: "Comprehensive evaluation of Indonesian public healthcare portals against WCAG 2.1 Level AA standards, identifying navigation barriers for visually and motor-impaired individuals.",
        arch: "Site Crawling -> Automated WAVE / Axe DevTools Audits -> Manual Screen Reader (NVDA) Testing -> Statistical Compliance Reporting",
        stack: ["WCAG 2.1", "WAVE Tool", "Axe DevTools", "NVDA", "HTML Semantics"]
      },
      "04": {
        title: "Laravel Store & Internal Management System",
        category: "Fullstack Web Development",
        desc: "Robust business management portal featuring role-based authentication, real-time inventory tracking, transaction accounting, and an integrated customer ordering interface.",
        arch: "Blade UI / Vite Assets -> Laravel MVC Controller -> Eloquent ORM Security Guard -> MySQL Relational Database",
        stack: ["PHP", "Laravel", "MySQL", "Vite", "Bootstrap", "REST API"]
      }
    };

    const openProject = (id) => {
      const data = projectData[id] || projectData["01"];
      if (titleEl) titleEl.textContent = data.title;
      if (descEl) descEl.textContent = data.desc;
      if (archEl) archEl.textContent = data.arch;

      if (stackEl) {
        stackEl.innerHTML = "";
        data.stack.forEach((tech) => {
          const span = document.createElement("span");
          span.textContent = tech;
          stackEl.appendChild(span);
        });
      }

      modal.classList.add("open");
      SoundFX.laser();
    };

    closeBtn?.addEventListener("click", () => {
      modal.classList.remove("open");
      SoundFX.click();
    });

    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("open");
        SoundFX.click();
      }
    });

    // Attach to project cards
    // Card-click popup disabled: "Inspect Architecture" was removed from project cards.

    return { open: openProject };
  })();

  // ------------------------------------------------------------------------
  // 11. TIMELINE EXPERIENCE FILTER CHIPS
  // ------------------------------------------------------------------------
  (() => {
    const chips = document.querySelectorAll(".timeline-chip");
    const items = document.querySelectorAll(".timeline-item");

    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        SoundFX.click();
        chips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");

        const filter = chip.dataset.filter; // 'all', 'work', 'org', 'education'
        items.forEach((item) => {
          const type = (item.querySelector(".timeline-type")?.textContent || "").toLowerCase();
          let show = false;

          if (filter === "all") {
            show = true;
          } else if (filter === "work") {
            show = type.includes("freelance") || type.includes("volunteer") || type.includes("content") || type.includes("internship");
          } else if (filter === "org") {
            show = type.includes("organization") || type.includes("student") || type.includes("instructor");
          } else if (filter === "education") {
            show = type.includes("education");
          }

          item.style.display = show ? "grid" : "none";
        });
      });
    });
  })();

  // ------------------------------------------------------------------------
  // 12. CONTACT FORM (NETLIFY FORMS) WITH CONFETTI
  // ------------------------------------------------------------------------
  (() => {
    const form = document.getElementById("interactiveContactForm");
    const subjectPills = document.querySelectorAll(".subject-pill");
    const subjectInput = document.getElementById("contactSubject");

    subjectPills.forEach((pill) => {
      pill.addEventListener("click", () => {
        SoundFX.click();
        subjectPills.forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
        if (subjectInput) subjectInput.value = pill.dataset.subject || pill.textContent;
      });
    });

    if (form) {
      const statusEl = document.getElementById("contactStatus");
      const submitBtn = form.querySelector('button[type="submit"]');
      const isID = () => window.__lang === "id";
      const setStatus = (msg, type) => {
        if (!statusEl) return;
        statusEl.textContent = msg;
        statusEl.className = "form-status" + (type ? " " + type : "");
      };
      const toastMsg = (msg) => {
        const toast = document.getElementById("toast");
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 3500);
      };

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        SoundFX.click();

        // Honeypot: bots fill this hidden field, humans never see it.
        const hp = form.querySelector('[name="bot-field"]');
        if (hp && hp.value) return;

        if (!form.checkValidity()) { form.reportValidity(); return; }

        const data = new FormData(form);
        const name = data.get("name") || "";
        const email = data.get("email") || "";
        const subject = data.get("subject") || "General Inquiry";
        const message = data.get("message") || "";

        submitBtn.disabled = true;
        submitBtn.classList.add("is-sending");
        setStatus(isID() ? "Mengirim pesan..." : "Sending your message...", "");

        try {
          const res = await fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(data).toString()
          });
          if (!res.ok) throw new Error("HTTP " + res.status);

          triggerConfetti();
          SoundFX.success();
          const ok = isID()
            ? "Pesan terkirim! Terima kasih, saya akan segera membalas. ✓"
            : "Message sent! Thank you, I'll get back to you soon. ✓";
          setStatus(ok, "success");
          toastMsg(ok);
          form.reset();
          // reset topic pills back to the default
          subjectPills.forEach((p, i) => p.classList.toggle("active", i === 0));
          if (subjectInput) subjectInput.value = subjectPills[0]?.dataset.subject || "General Inquiry";
        } catch (err) {
          // Sending failed (offline, running locally, or form not deployed): offer a mailto fallback.
          const mailto = `mailto:radenalexander14@gmail.com?subject=${encodeURIComponent(
            `[Portfolio] ${subject} - from ${name}`
          )}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
          setStatus("", "error");
          statusEl.append(
            document.createTextNode(isID()
              ? "Pesan gagal terkirim. Silakan coba lagi, atau "
              : "Couldn't send your message. Please try again, or "),
            Object.assign(document.createElement("a"), {
              href: mailto,
              textContent: isID() ? "kirim lewat aplikasi email Anda" : "send it from your email app"
            }),
            document.createTextNode(".")
          );
          toastMsg(isID() ? "Pesan gagal terkirim" : "Message failed to send");
        } finally {
          submitBtn.disabled = false;
          submitBtn.classList.remove("is-sending");
        }
      });
    }
  })();

  // ------------------------------------------------------------------------
  // 13. FULLSCREEN CONFETTI ENGINE (Pure Canvas)
  // ------------------------------------------------------------------------
  const triggerConfetti = () => {
    const canvas = document.getElementById("confettiCanvas") || document.createElement("canvas");
    canvas.id = "confettiCanvas";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ["#00f2fe", "#4facfe", "#00ff88", "#ffb703", "#ff3366", "#8a2be2"];
    const pieces = [];
    const count = 120;

    for (let i = 0; i < count; i++) {
      pieces.push({
        x: width * 0.5,
        y: height * 0.4,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rSpeed: (Math.random() - 0.5) * 12,
        gravity: 0.35,
        opacity: 1
      });
    }

    let start = performance.now();
    const render = (now) => {
      ctx.clearRect(0, 0, width, height);
      let alive = false;

      pieces.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.rotation += p.rSpeed;
        p.opacity -= 0.008;

        if (p.opacity > 0) {
          alive = true;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = Math.max(p.opacity, 0);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
          ctx.restore();
        }
      });

      if (alive) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    requestAnimationFrame(render);
  };

  // ------------------------------------------------------------------------
  // 14. GLOBAL HELPERS & HUD SHORTCUTS
  // ------------------------------------------------------------------------
  const escapeHTML = (str) =>
    str.replace(/[&<>'"]/g, (tag) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[tag] || tag));

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const toggleCanvasFX = () => {
    const mode = CanvasBackground.toggleMode();
    const btn = document.getElementById("fxToggleBtn");
    if (btn) {
      btn.textContent = `⚡ FX: ${mode.toUpperCase()}`;
    }
  };

  // Attach button triggers
  document.getElementById("terminalLauncherBtn")?.addEventListener("click", () => CyberTerminal.open());
  document.getElementById("cmdPaletteBtn")?.addEventListener("click", () => CommandPalette.open());
  document.getElementById("fxToggleBtn")?.addEventListener("click", () => toggleCanvasFX());

  // Copy email audio & celebration hook
  document.getElementById("copyEmail")?.addEventListener("click", () => {
    SoundFX.success();
    triggerConfetti();
  });

  // Konami Code Easter Egg: Up Up Down Down Left Right Left Right B A
  const konamiSeq = ["arrowup", "arrowup", "arrowdown", "arrowdown", "arrowleft", "arrowright", "arrowleft", "arrowright", "b", "a"];
  let konamiIdx = 0;
  window.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === konamiSeq[konamiIdx]) {
      konamiIdx++;
      if (konamiIdx === konamiSeq.length) {
        konamiIdx = 0;
        CanvasBackground.setMode("matrix");
        CyberTerminal.open();
        setTimeout(() => {
          CyberTerminal.execute("sudo hire");
        }, 400);
      }
    } else {
      konamiIdx = 0;
    }
  });

  // Make globally available
  window.CyberTerminal = CyberTerminal;
  window.CommandPalette = CommandPalette;
  window.triggerConfetti = triggerConfetti;
  window.SoundFX = SoundFX;
})();
