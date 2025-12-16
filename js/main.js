// =========================
// PAGE TRANSITIONS
// =========================
document.addEventListener("DOMContentLoaded", () => {
  // 1. Fade In
  setTimeout(() => {
    document.body.classList.add("loaded");
  }, 50);

  // 2. Fade Out on Link Click
  const links = document.querySelectorAll("a");

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");

      // Check if it's a valid internal link
      // We skip: #hashes, empty links, open-in-new-tab (ctrl+click handled by browser default usually but let's be safe), external links
      if (
        !href ||
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        link.target === "_blank" ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      ) {
        return;
      }

      e.preventDefault();
      document.body.classList.remove("loaded");

      // Wait for transition, then go
      setTimeout(() => {
        window.location.href = href;
      }, 400); // 0.4s matches CSS
    });
  });
});

// Handling 'Back' button cache (bfcache)
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    document.body.classList.add("loaded");
  }
});

// =========================
// CONTACT FORM VALIDATION
// =========================

function isValidEmail(email) {
  // simple email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function setError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

function clearErrors() {
  setError("nameError", "");
  setError("emailError", "");
  setError("subjectError", "");
  setError("messageError", "");
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  if (!form) return; // only runs on contact page

  const success = document.getElementById("formSuccess");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearErrors();
    if (success) success.textContent = "";

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();

    let ok = true;

    if (name.length < 2) {
      setError("nameError", "Please enter your full name.");
      ok = false;
    }

    if (!isValidEmail(email)) {
      setError("emailError", "Please enter a valid email address.");
      ok = false;
    }

    if (subject.length < 3) {
      setError("subjectError", "Please enter a subject (min 3 characters).");
      ok = false;
    }

    if (message.length < 10) {
      setError("messageError", "Message should be at least 10 characters.");
      ok = false;
    }

    if (ok) {
      // Success UI (no backend)
      if (success) success.textContent = "Message sent successfully! ✅";
      form.reset();
    }
  });
});

/* -------------------------
   SLEEP CALCULATOR & SOUNDS
------------------------- */
// --- REUSABLE CUSTOM DROPDOWN LOGIC ---
function setupCustomDropdown(wrapperId, inputId) {
  const wrapper = document.getElementById(wrapperId);
  const hiddenInput = document.getElementById(inputId);

  if (!wrapper || !hiddenInput) return;

  const trigger = wrapper.querySelector(".custom-select-trigger");
  const options = wrapper.querySelectorAll(".option");
  const triggerSpan = trigger.querySelector("span");

  // Toggle Dropdown
  trigger.addEventListener("click", (e) => {
    e.preventDefault();
    // Close other open dropdowns if any
    document.querySelectorAll('.custom-select-wrapper.open').forEach(openWrapper => {
      if (openWrapper !== wrapper) openWrapper.classList.remove('open');
    });
    wrapper.classList.toggle("open");
  });

  // Option Selection
  options.forEach(option => {
    option.addEventListener("click", () => {
      const value = option.getAttribute("data-value");
      const text = option.textContent;

      // Update Hidden Input
      hiddenInput.value = value;

      // Update UI
      triggerSpan.textContent = text;
      trigger.style.borderColor = "var(--accent)";

      // Close Dropdown
      wrapper.classList.remove("open");

      // Highlight selected
      options.forEach(opt => opt.classList.remove("selected"));
      option.classList.add("selected");
    });
  });

  // Close when clicking outside
  document.addEventListener("click", (e) => {
    if (!wrapper.contains(e.target)) {
      wrapper.classList.remove("open");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const sleepForm = document.getElementById("sleepForm");
  if (sleepForm) {
    // Initialize Custom Dropdown for Sleep
    setupCustomDropdown("customSleepSelect", "sleepSound");
    setupCustomDropdown("customEnergySelect", "energy");

    sleepForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const wakeTime = document.getElementById("wake").value;
      const energy = document.getElementById("energy").value;
      const sound = document.getElementById("sleepSound").value; // Hidden Input Value now

      const resultDiv = document.getElementById("sleepResult");

      // Calculate Bedtime
      let sleepHours = 8;
      if (energy === "high") sleepHours = 7.5; // active, maybe less sleep needed?
      if (energy === "low") sleepHours = 9;    // tired, need more sleep

      if (!wakeTime || !energy) {
        resultDiv.innerHTML = "<p style='color:#f87171'>Please fill in all fields.</p>";
        return;
      }

      // Simple calculation (mock logic)
      // Convert time to Date object to subtract hours
      const [hours, minutes] = wakeTime.split(":");
      const date = new Date();
      date.setHours(Number(hours));
      date.setMinutes(Number(minutes));
      date.setHours(date.getHours() - sleepHours);

      const bedtime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      // Generate Message
      let message = `<div style="margin-bottom:20px;">
        <h3 style="color:var(--accent); margin-bottom:8px;">Suggested Bedtime: ${bedtime}</h3>
        <p>Aim for ${sleepHours} hours of sleep.</p>
      </div>`;

      // Append Sound Player if selected
      if (sound) {
        const playlists = {
          rain: "2VguXjS2r3HQG2aoXnDSDI",
          white: "2ZpNtjjARJMBygF8JDj3QI",
          fire: "7z49ShCHMRO1tE5NJttr5E",
          piano: "10bwR2Hrp6nEAb5s0ot30z",
          brown: "4AdvDlgiQirSYfaC3Phk0W"
        };

        const playlistId = playlists[sound];
        if (playlistId) {
          message += `
             <div class="spotify-container" style="animation: fadeIn 0.5s ease;">
                <iframe
                  style="border-radius:12px"
                  src="https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator"
                  width="100%"
                  height="152"
                  frameborder="0"
                  allowfullscreen=""
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy">
                </iframe>
                <div style="margin-top:10px; text-align:center;">
                  <a href="https://open.spotify.com/playlist/${playlistId}" target="_blank" class="spotify-fallback" style="display:inline-block; margin-top:8px; font-size:0.9rem; color:var(--accent); text-decoration:none; border:1px solid rgba(255,255,255,0.2); padding:6px 14px; border-radius:20px; transition:0.3s;">
                    <i class="fa-brands fa-spotify"></i> Open in Spotify
                  </a>
                </div>
             </div>
           `;
        }
      }

      resultDiv.innerHTML = message;
    });
  }
});
// =========================
// FOCUS MODE (JS)
// =========================

document.addEventListener("DOMContentLoaded", () => {
  const focusForm = document.getElementById("focusForm");
  if (!focusForm) return;

  const result = document.getElementById("focusResult");
  const hiddenInput = document.getElementById("focusType"); // This is now a hidden input

  // Focus Message Generator (Same as before)
  function getFocusMessage(type) {
    const playlists = {
      lofi: { id: "5HighaDp6bN17cBjeIxOHB", title: "Lo-fi Focus" },
      office: { id: "2fMgVoMVWQz9dfetq6v9HC", title: "Office Ambience" },
      library: { id: "1OANI9Xt6VqlfU1DGXZvDV", title: "Library Silence" },
      cafe: { id: "73IoykbJwJwbgSeAIbFQ3Q", title: "Cafe Noise" }
    };

    const selected = playlists[type];
    if (selected) {
      return `
        <div class="spotify-container" style="margin-top:20px; animation: fadeIn 0.5s ease;">
          <p style="margin-bottom:10px;">🎧 Playing <strong>${selected.title}</strong>:</p>
          <iframe
            style="border-radius:12px"
            src="https://open.spotify.com/embed/playlist/${selected.id}?utm_source=generator"
            width="100%"
            height="352"
            frameborder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy">
          </iframe>
          <div style="margin-top:10px; text-align:center;">
             <a href="https://open.spotify.com/playlist/${selected.id}" target="_blank" class="spotify-fallback" style="display:inline-block; margin-top:8px; font-size:0.9rem; color:var(--accent); text-decoration:none; border:1px solid rgba(255,255,255,0.2); padding:6px 14px; border-radius:20px; transition:0.3s;">
                <i class="fa-brands fa-spotify"></i> Open in Spotify
             </a>
          </div>
        </div>
      `;
    }
    return "Choose a sound to start focusing.";
  }

  // Initialize Focus Dropdown
  setupCustomDropdown("customFocusSelect", "focusType");

  // Handle Form Submit
  focusForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!hiddenInput.value) {
      result.innerHTML = "<p class='error' style='color:#f87171; background:rgba(255,0,0,0.1); padding:10px; border-radius:10px;'>Please select a sound type first.</p>";
      return;
    }

    result.innerHTML = getFocusMessage(hiddenInput.value);
  });
});

// =========================
// MOBILE MENU TOGGLE
// =========================
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.querySelector(".mobile-toggle");
  const navLinks = document.querySelector(".nav-links");
  const navTools = document.querySelector(".nav-tools");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      navTools.classList.toggle("active");
    });
  }

  // Back to Top Button
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }
});


// =========================
// BACKGROUND STARS
// =========================
function createBackgroundStars() {
  // Use body to cover full page height
  const container = document.body;

  const count = 25; // "Az ve öz" (Few and elegant)

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.classList.add('bg-star');

    // Random Position covering full scroll height
    const x = Math.random() * 100; // % width
    const scrollHeight = document.documentElement.scrollHeight;
    const y = Math.random() * scrollHeight; // px height

    // Random Animation Properties
    const duration = 2 + Math.random() * 3;
    const delay = Math.random() * 5;
    const size = 2 + Math.random() * 3;
    const maxOpacity = 0.4 + Math.random() * 0.6;

    // Apply Styles
    star.style.position = 'absolute'; // Ensure absolute positioning
    star.style.left = `${x}%`;
    star.style.top = `${y}px`; // Use pixels for height
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.zIndex = '-2'; // Behind everything (global glow is -1)

    star.style.setProperty('--duration', `${duration}s`);
    star.style.setProperty('--delay', `${delay}s`);
    star.style.setProperty('--max-opacity', maxOpacity);

    container.appendChild(star);
  }
}


document.addEventListener("DOMContentLoaded", () => {
  createBackgroundStars();

  // Moon Click Interaction (Focus Page & Home Page)
  const planetBox = document.querySelector(".planet-box");
  const moonBox = document.querySelector(".moon-box"); // Home Page

  if (planetBox) {
    planetBox.style.cursor = "pointer";
    planetBox.addEventListener("click", (e) => {
      createParticles(e.clientX, e.clientY);
    });
  }

  if (moonBox) {
    // Ambient Layout for Home Page (Continuous flow)
    startHomepageParticles();
  }

  // Sheep Click Interaction (Sleep Page)
  const sheepBox = document.querySelector(".sheep-box");
  let isRight = false; // Track position

  if (sheepBox) {
    sheepBox.addEventListener("click", () => {
      const sheep = sheepBox.querySelector(".sheep");
      if (sheep) {
        // Prevent double clicks during animation
        if (sheep.classList.contains("jumping-right") || sheep.classList.contains("jumping-left")) return;

        // Wake up
        sheep.classList.add("awake");
        sheep.classList.add("leg-action");

        if (!isRight) {
          // Jump RIGHT
          sheep.classList.add("jumping-right");
        } else {
          // Jump LEFT
          sheep.classList.remove("side-right"); // Remove persistent state immediately
          sheep.classList.remove("on-right");   // Remove backup class if present
          sheep.classList.add("jumping-left");
        }

        // Handle Landing
        setTimeout(() => {
          // Toggle state
          isRight = !isRight;

          // Cleanup animation classes
          sheep.classList.remove("jumping-right");
          sheep.classList.remove("jumping-left");
          sheep.classList.remove("leg-action");

          // Set persistent side class
          if (isRight) {
            sheep.classList.add("side-right");
          } else {
            sheep.classList.remove("side-right");
          }

          // Go back to sleep
          sheep.classList.remove("awake");

        }, 1000); // 1s matches animation
      }
    });
  }
});

function startHomepageParticles() {
  // Spawn a particle every 400ms
  setInterval(() => {
    // Only if tab is visible to save resources
    if (document.hidden) return;

    createAmbientParticle();
  }, 400);
}

function createAmbientParticle() {
  const particle = document.createElement("div");
  particle.classList.add("glow-particle");
  particle.style.zIndex = "3"; // Behind moon (5), in front of background
  document.body.appendChild(particle);

  // Start from Center
  const startX = window.innerWidth / 2;
  const startY = 400; // Approx moon center height (hero is 400px high)

  // Random Angle
  const angle = Math.random() * Math.PI * 2;
  const velocity = 200 + Math.random() * 300; // Distance to travel

  const tx = Math.cos(angle) * velocity;
  const ty = Math.sin(angle) * velocity;

  particle.style.left = `${startX}px`;
  particle.style.top = `${startY}px`;

  // Animate
  const animation = particle.animate([
    { transform: 'translate(0, 0) scale(0)', opacity: 0 },
    { transform: `translate(${tx * 0.2}px, ${ty * 0.2}px) scale(1)`, opacity: 0.6, offset: 0.2 },
    { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0 }
  ], {
    duration: 6000 + Math.random() * 4000, // 6-10s duration
    easing: 'ease-out'
  });

  animation.onfinish = () => particle.remove();
}

function createParticles(x, y) {
  const count = 150; // High count for impact
  const maxDist = Math.max(window.innerWidth, window.innerHeight); // Cover full screen

  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.classList.add("glow-particle");

    // Z-Index: Behind the planet (Planet is 10)
    particle.style.zIndex = "5";

    document.body.appendChild(particle);

    // Random Angle
    const angle = Math.random() * Math.PI * 2;

    // Velocity: FULL PAGE SPREAD
    // Minimum 100px to ensure they leave the immediate center
    const velocity = 100 + Math.random() * maxDist;

    // Calculate Target Position
    const tx = Math.cos(angle) * velocity;
    const ty = Math.sin(angle) * velocity;

    // Set initial position at click source
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    // Animate: SLOW Emerge from behind -> Very Slow Spread -> Fade
    particle.animate([
      { transform: `translate(0, 0) scale(0)`, opacity: 0, offset: 0 },
      { transform: `translate(${tx * 0.1}px, ${ty * 0.1}px) scale(1)`, opacity: 0.8, offset: 0.3 }, // Take 30% of time to just appear (Slow start)
      { transform: `translate(${tx}px, ${ty}px) scale(0)`, opacity: 0, offset: 1 } // Travel to edge
    ], {
      duration: 20000 + Math.random() * 5000, // EXTREME SLOW (20s-25s)
      easing: 'cubic-bezier(0.2, 1, 0.3, 1)', // Soft ease out
      fill: 'forwards'
    });

    // Remove after animation
    setTimeout(() => {
      particle.remove();
    }, 26000); // 26s cleanup
  }
}
