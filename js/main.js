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
document.addEventListener("DOMContentLoaded", () => {
  const sleepForm = document.getElementById("sleepForm");
  if (sleepForm) {
    sleepForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const wakeTime = document.getElementById("wake").value;
      const energy = document.getElementById("energy").value;
      const sound = document.getElementById("sleepSound").value; // New Grid

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

function getFocusMessage(type) {
  const playlists = {
    lofi: {
      id: "5HighaDp6bN17cBjeIxOHB",
      title: "Lo-fi Focus"
    },
    office: {
      id: "2fMgVoMVWQz9dfetq6v9HC",
      title: "Office Ambience"
    },
    library: {
      id: "1OANI9Xt6VqlfU1DGXZvDV",
      title: "Library Silence"
    },
    cafe: {
      id: "73IoykbJwJwbgSeAIbFQ3Q",
      title: "Cafe Noise"
    }
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
      </div>
    `;
  }

  return "Choose a sound to start focusing.";
}

document.addEventListener("DOMContentLoaded", () => {
  const focusForm = document.getElementById("focusForm");
  if (!focusForm) return; // only runs on focus page

  const result = document.getElementById("focusResult");
  const select = document.getElementById("focusType");

  focusForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!select.value) {
      result.innerHTML = "<p class='error'>Please select a sound type.</p>";
      return;
    }

    result.innerHTML = getFocusMessage(select.value);
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
});

