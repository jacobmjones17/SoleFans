(function () {
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* —— Gallery unlock —— */
  function finishUnlock(card) {
    card.classList.remove("is-locked");
    card.classList.remove("is-unwrapping");
    var unlockBtn = card.querySelector(".gallery-unlock");
    if (unlockBtn) {
      unlockBtn.disabled = true;
      unlockBtn.textContent = "Unwrapped";
    }
    var media = card.querySelector(".gallery-media");
    if (media) {
      media.setAttribute("aria-label", "Gallery preview");
    }
  }

  function unlockGalleryCard(card) {
    if (!card.classList.contains("is-locked") || card.classList.contains("is-unwrapping")) return;
    if (prefersReducedMotion) {
      finishUnlock(card);
      return;
    }
    card.classList.add("is-unwrapping");
    window.setTimeout(function () {
      finishUnlock(card);
    }, 1250);
  }

  document.querySelectorAll("[data-gallery-card]").forEach(function (card) {
    var unlockBtn = card.querySelector(".gallery-unlock");
    var media = card.querySelector(".gallery-media");

    if (unlockBtn) {
      unlockBtn.addEventListener("click", function () {
        unlockGalleryCard(card);
      });
    }

    if (media) {
      media.addEventListener("click", function () {
        unlockGalleryCard(card);
      });
      media.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          unlockGalleryCard(card);
        }
      });
      media.setAttribute("tabindex", "0");
      media.setAttribute("role", "button");
      media.setAttribute(
        "aria-label",
        card.classList.contains("is-locked") ? "Unwrap the sock to see the photo" : "Gallery preview"
      );
    }
  });

  /* —— Payment modal (all plans) —— */
  var paymentModal = document.getElementById("payment-modal");
  var paymentClose = document.getElementById("payment-close");

  var paymentMessage = document.getElementById("payment-message");
  var paymentFine = document.getElementById("payment-fine");
  var paymentQr = document.getElementById("payment-qr");
  var paymentTitle = document.getElementById("payment-title");
  var planCopy = {
    free: {
      title: "Payment declined",
      message: "Your dignity has already been charged.",
      fine: "Nothing on this site is for sale. This is a joke. Put your wallet away.",
      qr: false
    },
    mate: {
      title: "Payment declined",
      message: "You could be paying for Netflix but instead you want to see feet. Weirdo.",
      fine: "",
      qr: false
    },
    freak: {
      title: "Payment declined",
      message: "Since you are willing to throw money away. Send me $99.99 in Venmo.",
      fine: "",
      qr: true
    }
  };

  function openPaymentModal(plan) {
    var copy = planCopy[plan] || planCopy.free;
    paymentTitle.textContent = copy.title;
    paymentMessage.textContent = copy.message;
    paymentFine.textContent = copy.fine;
    paymentFine.hidden = !copy.fine;
    paymentQr.hidden = !copy.qr;
    paymentModal.hidden = false;
    paymentModal.classList.add("is-open");
    paymentClose.focus();
  }

  function closePaymentModal() {
    paymentModal.classList.remove("is-open");
    paymentModal.hidden = true;
  }

  document.querySelectorAll(".plan-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      openPaymentModal(btn.getAttribute("data-plan"));
    });
  });

  paymentClose.addEventListener("click", closePaymentModal);
  paymentModal.addEventListener("click", function (e) {
    if (e.target === paymentModal) closePaymentModal();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && paymentModal.classList.contains("is-open")) {
      closePaymentModal();
    }
  });

  /* —— Quiz —— */
  var quizResponses = {
    8: "Close! You forgot the two toes that only unlock on Wi‑Fi.",
    10: "Correct. A real foot scholar. Still weird in public, though.",
    12: "You have a freaky foot fetish if you chose 12.",
    tier: "Correct answer for this website. Your card was still declined."
  };

  var quizResult = document.getElementById("quiz-result");

  document.querySelectorAll("[data-quiz]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var key = btn.getAttribute("data-quiz");
      quizResult.textContent = quizResponses[key] || "The toes are thinking about it.";
      quizResult.classList.add("is-visible");
    });
  });

  /* —— Forbidden toe reveal —— */
  var forbidden = document.getElementById("forbidden-reveal");
  if (forbidden) {
    function revealForbidden() {
      forbidden.classList.remove("is-blurred");
      forbidden.setAttribute("aria-label", "Revealed: oh no, that is absolutely a toe");
      var img = forbidden.querySelector("img");
      if (img) img.alt = "Forbidden toe revealed";
    }
    forbidden.addEventListener("click", revealForbidden);
    forbidden.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        revealForbidden();
      }
    });
  }

  /* —— Rotating joke feed —— */
  var feedLines = [
    "Terminal B just unlocked a toe.",
    "3 new subscribers interested in ankles. (Fictional.)",
    "Local marriage tested by this QR code.",
    "TSA has questions. So does your browser history.",
    "Gate C12 reports suspicious foot traffic.",
    "Someone scanned 'for a friend.' Sure.",
    "Husband status: laughing too hard in Terminal B."
  ];

  var feedEl = document.getElementById("feed-text");
  var feedIndex = 0;

  function rotateFeed() {
    if (!feedEl || prefersReducedMotion) return;
    feedEl.classList.add("is-fading");
    setTimeout(function () {
      feedIndex = (feedIndex + 1) % feedLines.length;
      feedEl.textContent = feedLines[feedIndex];
      feedEl.classList.remove("is-fading");
    }, 280);
  }

  setInterval(rotateFeed, 4500);

  /* —— Confetti on finale —— */
  var confettiCanvas = document.getElementById("confetti-canvas");
  var confettiFired = false;

  function fireConfetti() {
    if (confettiFired || !confettiCanvas || prefersReducedMotion) return;
    confettiFired = true;

    var ctx = confettiCanvas.getContext("2d");
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    var colors = ["#ff4fa3", "#ff8fc8", "#ffd4ea", "#ffffff", "#c77dff"];
    var pieces = [];

    for (var i = 0; i < 100; i++) {
      pieces.push({
        x: Math.random() * confettiCanvas.width,
        y: -Math.random() * confettiCanvas.height,
        w: 6 + Math.random() * 6,
        h: 4 + Math.random() * 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        vy: 2 + Math.random() * 3,
        vx: -1.5 + Math.random() * 3,
        rot: Math.random() * 360
      });
    }

    var frame = 0;

    function draw() {
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      pieces.forEach(function (p) {
        p.y += p.vy;
        p.x += p.vx;
        p.rot += 6;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rot * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        ctx.restore();
      });
      frame++;
      if (frame < 90) requestAnimationFrame(draw);
      else ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    }

    draw();
  }

  var finale = document.getElementById("finale");
  if (finale && "IntersectionObserver" in window) {
    new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
            fireConfetti();
          }
        });
      },
      { threshold: 0.25 }
    ).observe(finale);
  }

  /* —— Regret button: full-screen emoji storm —— */
  var regretEmojis = [
    "🦶", "🦶", "🦶", "👣", "👣", "🧦", "🧦", "🩴", "👟", "👞", "👠", "🥿", "👡",
    "🥵", "🤤", "😍", "👅", "🥵", "🤤", "🦶", "👣", "🧦", "🩴", "👟", "🦶", "👣"
  ];

  var footEmojis = { "🦶": true, "👣": true };

  function spawnEmojiParticle(opts) {
    var emoji = regretEmojis[Math.floor(Math.random() * regretEmojis.length)];
    var isFoot = footEmojis[emoji];
    var el = document.createElement("span");
    el.className = "emoji-particle emoji-particle--" + opts.mode + (isFoot ? " emoji-particle--foot" : "");
    el.textContent = emoji;
    el.style.left = opts.x + "vw";
    el.style.top = opts.y + "vh";
    var footScale = window.matchMedia("(max-width: 639px)").matches ? 3.2 : 3.8;
    el.style.fontSize = (isFoot ? footScale + Math.random() * 2 : opts.size) + "rem";
    el.style.animationDuration = opts.duration + "s";
    el.style.animationDelay = (opts.delay || 0) + "s";
    document.body.appendChild(el);
    setTimeout(function () {
      el.remove();
    }, (opts.duration + (opts.delay || 0)) * 1000 + 200);
  }

  function regretNothingStorm() {
    var i;
    var mobile = window.matchMedia("(max-width: 639px)").matches;
    var burstN = mobile ? 38 : 55;
    var rainN = mobile ? 28 : 40;
    var riseN = mobile ? 24 : 35;

    for (i = 0; i < burstN; i++) {
      spawnEmojiParticle({
        mode: "burst",
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1.4 + Math.random() * 2.8,
        duration: 1.8 + Math.random() * 1.4,
        delay: Math.random() * 0.35
      });
    }

    for (i = 0; i < rainN; i++) {
      spawnEmojiParticle({
        mode: "rain",
        x: Math.random() * 100,
        y: -5 - Math.random() * 15,
        size: 1.2 + Math.random() * 2.2,
        duration: 2 + Math.random() * 1.2,
        delay: Math.random() * 0.5
      });
    }

    for (i = 0; i < riseN; i++) {
      spawnEmojiParticle({
        mode: "rise",
        x: Math.random() * 100,
        y: 95 + Math.random() * 10,
        size: 1.3 + Math.random() * 2.5,
        duration: 2.1 + Math.random() * 1.3,
        delay: Math.random() * 0.4
      });
    }
  }

  var regretBtn = document.getElementById("regret-btn");
  if (regretBtn) {
    regretBtn.addEventListener("click", function () {
      if (prefersReducedMotion) return;
      regretNothingStorm();
      setTimeout(regretNothingStorm, 450);
      if (navigator.vibrate) {
        navigator.vibrate([50, 40, 50, 40, 120]);
      }
    });
  }
})();
