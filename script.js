(() => {
  const cookie = document.getElementById("cookie");
  const cookieOk = document.getElementById("cookie-ok");
  const navToggle = document.getElementById("nav-toggle");
  const top = document.querySelector(".top");
  const quizForm = document.getElementById("quiz-form");
  const contactForm = document.getElementById("contact-form");

  if (cookie && !sessionStorage.getItem("somn-cookie")) {
    requestAnimationFrame(() => cookie.classList.add("is-visible"));
  }

  cookieOk?.addEventListener("click", () => {
    sessionStorage.setItem("somn-cookie", "1");
    cookie?.classList.remove("is-visible");
  });

  const setMenuOpen = (open) => {
    top?.classList.toggle("is-open", open);
    navToggle?.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle?.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    document.body.classList.toggle("menu-open", open);
  };

  navToggle?.addEventListener("click", () => {
    setMenuOpen(!top?.classList.contains("is-open"));
  });

  document.querySelectorAll(".nav a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  window.addEventListener("resize", () => {
    if (window.matchMedia("(min-width: 761px)").matches) setMenuOpen(false);
  });

  const revealTargets = document.querySelectorAll(
    ".why__list, .construct .accordion, .promise__grid, .projects__grid, .about__grid, .steps, .quiz__panel, .faq .accordion, .contact__grid"
  );

  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }

  quizForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const msg = document.getElementById("quiz-msg");
    if (msg) msg.hidden = false;
    quizForm.reset();
  });

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const msg = document.getElementById("contact-msg");
    if (msg) msg.hidden = false;
    contactForm.reset();
  });
})();
