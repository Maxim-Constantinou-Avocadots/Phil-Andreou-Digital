(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
  const greek = document.documentElement.lang === "el";
  const text = (en, el) => greek ? el : en;
  const localPath = (path) => greek ? path === "/" ? "/el/index.html" : "/el" + path : path;
  $$("[data-language]").forEach((anchor) => {
    const destination = new URL(anchor.href);
    destination.search = window.location.search;
    destination.hash = window.location.hash;
    anchor.href = destination.pathname + destination.search + destination.hash;
  });
  $$('link[rel="alternate"][hreflang]').forEach((link) => {
    const destination = new URL(link.href);
    destination.search = window.location.search;
    link.href = destination.href;
  });
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const quoteDialog = $("#quote-dialog");
  const quoteMount = $("#quote-app");
  const inlineQuote = quoteMount?.dataset.inline === "true";
  const projectDialog = $("#project-dialog");
  const menuButton = $(".menu-toggle");
  const mobileMenu = $("#mobile-menu");
  const navDetails = $(".nav-services");
  let contentPromise;

  function loadContent() {
    if (!contentPromise) {
      contentPromise = fetch(greek ? "/assets/content.el.json" : "/assets/content.json")
        .then((response) => {
          if (!response.ok) throw new Error("Content is unavailable");
          return response.json();
        })
        .catch((error) => {
          contentPromise = null;
          throw error;
        });
    }
    return contentPromise;
  }

  const header = $(".site-header");
  const mobileServices = $(".mobile-services", mobileMenu);
  const mobileServicesSummary = $("summary", mobileServices);
  const mobileServicesPanel = $(".mobile-services-panel", mobileServices);
  const backgroundRegions = $$("body > main, body > footer");
  const originalInert = new Map();
  let menuCloseTimer;
  let servicesCloseTimer;
  let menuOpen = false;
  $$("a[href]", mobileMenu).forEach((anchor) => {
    if (anchor.hasAttribute("data-language")) return;
    const destination = new URL(anchor.href);
    if (!destination.hash && destination.pathname === window.location.pathname) {
      anchor.setAttribute("aria-current", "page");
    }
  });

  function setMobileServices(expanded, immediate = false) {
    clearTimeout(servicesCloseTimer);
    if (expanded) {
      mobileServices.open = true;
      mobileServicesPanel.getBoundingClientRect();
    }
    mobileServices.classList.toggle("is-expanded", expanded);
    mobileServicesSummary.setAttribute("aria-expanded", String(expanded));
    mobileServicesPanel.inert = !expanded;
    mobileServicesPanel.setAttribute("aria-hidden", String(!expanded));
    if (!expanded) {
      if (immediate || reducedMotion.matches) mobileServices.open = false;
      else servicesCloseTimer = setTimeout(() => { mobileServices.open = false; }, 360);
    }
  }
  mobileServices.classList.add("is-enhanced");
  setMobileServices(false, true);
  mobileServicesSummary.addEventListener("click", (event) => {
    event.preventDefault();
    setMobileServices(!mobileServices.classList.contains("is-expanded"));
  });

  function finishMenuClose() {
    clearTimeout(menuCloseTimer);
    if (menuOpen) return;
    mobileMenu.hidden = true;
    setMobileServices(false, true);
  }
  function closeMenu({ restoreFocus = false, immediate = false } = {}) {
    clearTimeout(menuCloseTimer);
    menuOpen = false;
    if (restoreFocus || mobileMenu.contains(document.activeElement)) {
      menuButton.focus({ preventScroll: true });
    }
    mobileMenu.classList.remove("is-open");
    mobileMenu.inert = true;
    mobileMenu.setAttribute("aria-hidden", "true");
    document.documentElement.classList.remove("mobile-menu-open");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", text("Open menu", "Άνοιγμα μενού"));
    backgroundRegions.forEach((region) => {
      if (originalInert.has(region)) region.inert = originalInert.get(region);
    });
    originalInert.clear();
    if (immediate || reducedMotion.matches || mobileMenu.hidden) finishMenuClose();
    else menuCloseTimer = setTimeout(finishMenuClose, 400);
  }
  function openMenu() {
    clearTimeout(menuCloseTimer);
    navDetails.open = false;
    setMobileServices(false, true);
    mobileMenu.hidden = false;
    mobileMenu.inert = false;
    mobileMenu.removeAttribute("aria-hidden");
    mobileMenu.scrollTop = 0;
    mobileMenu.getBoundingClientRect();
    menuOpen = true;
    mobileMenu.classList.add("is-open");
    document.documentElement.classList.add("mobile-menu-open");
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", text("Close menu", "Κλείσιμο μενού"));
    backgroundRegions.forEach((region) => {
      originalInert.set(region, region.inert);
      region.inert = true;
    });
    $(".mobile-nav-link", mobileMenu).focus({ preventScroll: true });
  }
  menuButton.addEventListener("click", () => {
    if (menuOpen) closeMenu({ restoreFocus: true });
    else openMenu();
  });
  mobileMenu.addEventListener("transitionend", (event) => {
    if (event.target === mobileMenu && event.propertyName === "transform") finishMenuClose();
  });
  $$("a", mobileMenu).forEach((anchor) => anchor.addEventListener("click", closeMenu));
  $$(".service-menu a").forEach((anchor) => anchor.addEventListener("click", () => { navDetails.open = false; }));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (menuOpen) closeMenu({ restoreFocus: true });
      navDetails.open = false;
    }
    if (event.key === "Tab" && menuOpen) {
      const targets = $$("a[href],button:not(:disabled),summary", header)
        .filter((element) => element.getClientRects().length && !element.closest("[inert]"));
      const first = targets[0];
      const last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });
  document.addEventListener("click", (event) => {
    if (!navDetails.contains(event.target)) navDetails.open = false;
    if (menuOpen && !header.contains(event.target)) closeMenu();
  });
  window.matchMedia("(min-width: 1101px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu({ immediate: true });
  });
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) {
      if (!menuOpen) finishMenuClose();
      if (!mobileServices.classList.contains("is-expanded")) setMobileServices(false, true);
    }
  });

  let quoteModulePromise;
  async function openQuote(trigger, shouldFocus = true) {
    closeMenu();
    navDetails.open = false;
    if (inlineQuote) {
      if (shouldFocus) quoteMount.scrollIntoView({ behavior: reducedMotion.matches ? "instant" : "smooth", block: "start" });
    } else if (!quoteDialog.open) quoteDialog.showModal();
    try {
      quoteModulePromise ||= import(inlineQuote ? quoteMount.dataset.module : quoteDialog.dataset.module);
      const module = await quoteModulePromise;
      module.openQuote(trigger.dataset.quote || "", { embedded: inlineQuote, shouldFocus });
    } catch {
      quoteModulePromise = null;
      const app = $("#quote-app");
      const heading = document.createElement("h2");
      heading.id = "quote-title";
      heading.textContent = text("Let’s talk.", "Ας μιλήσουμε.");
      const message = document.createElement("p");
      message.className = "dialog-intro";
      message.setAttribute("role", "alert");
      message.textContent = text("The enquiry form couldn’t be loaded. Please try again, or call +357 25 865270.", "Δεν ήταν δυνατή η φόρτωση της φόρμας. Δοκιμάστε ξανά ή καλέστε μας στο +357 25 865270.");
      const retry = document.createElement("button");
      retry.type = "button";
      retry.className = "button secondary";
      retry.textContent = text("Try again", "Δοκιμάστε ξανά");
      retry.addEventListener("click", () => openQuote(trigger));
      app.replaceChildren(heading, message, retry);
    }
  }
  $$("[data-quote]").forEach((trigger) => trigger.addEventListener("click", () => openQuote(trigger)));
  if (inlineQuote) openQuote({ dataset: {} }, false);
  $$("[data-close]").forEach((button) => {
    button.addEventListener("click", () => {
      const dialog = button.closest("dialog");
      if (dialog === projectDialog) closeProject();
      else dialog.close();
    });
  });
  $$("dialog").forEach((dialog) => {
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right ||
          event.clientY < rect.top || event.clientY > rect.bottom) {
        if (dialog === projectDialog) closeProject();
        else dialog.close();
      }
    });
  });

  let projectRequest = 0;
  let projectIndex = 0;
  let projectOpener;
  let projectClosing = false;
  const projectAnimations = new Set();
  const projectShell = $(".project-shell", projectDialog);
  const projectImage = $("#project-image");
  const projectCopy = $(".project-dialog-copy", projectDialog);

  function animateProject(element, frames, options) {
    if (reducedMotion.matches || !element.animate) return Promise.resolve();
    const animation = element.animate(frames, { easing: "cubic-bezier(.16,1,.3,1)", ...options });
    projectAnimations.add(animation);
    return animation.finished.catch(() => {}).finally(() => {
      projectAnimations.delete(animation);
      animation.cancel();
    });
  }

  function clearProjectMotion() {
    projectAnimations.forEach((animation) => animation.cancel());
    projectAnimations.clear();
    $$(".project-flight", projectDialog).forEach((image) => image.remove());
    projectImage.style.visibility = "";
  }

  async function decodeProject(project) {
    const image = new Image();
    image.src = "/assets/images/" + project.image;
    try { await image.decode(); } catch { /* The normal image remains the fallback. */ }
    return image.src;
  }

  function paintProject(project, source) {
    $("#project-title").textContent = project.title;
    $("#project-description").textContent = project.description;
    $("#project-detail").textContent = project.detail;
    $("#project-category").textContent = project.category;
    projectImage.src = source;
    projectImage.alt = project.description;
    $("#project-service").href = localPath("/services/" + project.service + ".html");
    projectCopy.scrollTop = 0;
  }

  async function revealProject(trigger) {
    const request = ++projectRequest;
    const content = await loadContent();
    const index = content.projects.findIndex((item) => item.id === trigger.dataset.project);
    if (index < 0) return;
    const project = content.projects[index];
    const source = await decodeProject(project);
    if (request !== projectRequest) return;
    clearProjectMotion();
    projectClosing = false;
    projectDialog.classList.remove("is-closing");
    projectOpener = trigger;
    projectIndex = index;
    const from = $("img", trigger).getBoundingClientRect();
    paintProject(project, source);
    if (!projectDialog.open) projectDialog.showModal();
    $(".project-layout", projectDialog).scrollTop = 0;
    $("#project-title").focus({ preventScroll: true });
    if (reducedMotion.matches) return;
    const target = projectImage.getBoundingClientRect();
    if (from.width > 0 && target.width > 0 && target.height > 0) {
      const flight = projectImage.cloneNode();
      flight.removeAttribute("id");
      flight.alt = "";
      flight.setAttribute("aria-hidden", "true");
      flight.className = "project-flight";
      Object.assign(flight.style, { left: target.left + "px", top: target.top + "px", width: target.width + "px", height: target.height + "px" });
      projectDialog.append(flight);
      projectImage.style.visibility = "hidden";
      animateProject(flight, [
        { transform: `translate(${from.left - target.left}px,${from.top - target.top}px) scale(${from.width / target.width},${from.height / target.height})` },
        { transform: "none" }
      ], { duration: 620 }).then(() => {
        flight.remove();
        if (request === projectRequest) projectImage.style.visibility = "";
      });
    }
    animateProject(projectShell, [
      { opacity: 0, transform: "translateY(20px) scale(.985)" },
      { opacity: 1, transform: "none" }
    ], { duration: 480 });
    animateProject(projectCopy, [
      { opacity: 0, transform: "translateX(24px)", clipPath: "inset(0 0 12% 0)" },
      { opacity: 1, transform: "none", clipPath: "inset(0)" }
    ], { duration: 520, delay: 100, fill: "backwards" });
  }

  async function closeProject() {
    if (!projectDialog.open || projectClosing) return;
    projectClosing = true;
    ++projectRequest;
    clearProjectMotion();
    projectDialog.classList.add("is-closing");
    await animateProject(projectShell, [
      { opacity: 1, transform: "none" },
      { opacity: 0, transform: "translateY(14px) scale(.985)" }
    ], { duration: 220, easing: "cubic-bezier(.4,0,1,1)", fill: "forwards" });
    projectDialog.close();
  }

  projectDialog?.addEventListener("cancel", (event) => {
    event.preventDefault();
    closeProject();
  });
  projectDialog?.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const controls = $$("a[href],button:not([disabled]),[tabindex='0']", projectDialog)
      .filter((element) => element.getClientRects().length);
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first) return;
    if (event.shiftKey && (document.activeElement === first || event.target === first)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (document.activeElement === last || event.target === last)) {
      event.preventDefault();
      first.focus();
    }
  });
  projectDialog?.addEventListener("close", () => {
    ++projectRequest;
    projectClosing = false;
    clearProjectMotion();
    projectDialog.classList.remove("is-closing");
    projectShell.removeAttribute("aria-busy");
    projectOpener?.focus({ preventScroll: true });
  });
  $$("[data-project-step]", projectDialog).forEach((button) => {
    button.addEventListener("click", async () => {
      if (!projectDialog.open || projectClosing) return;
      const request = ++projectRequest;
      projectShell.setAttribute("aria-busy", "true");
      try {
        const content = await loadContent();
        projectIndex = (projectIndex + Number(button.dataset.projectStep) + content.projects.length) % content.projects.length;
        const project = content.projects[projectIndex];
        const source = await decodeProject(project);
        if (request !== projectRequest || projectClosing || !projectDialog.open) return;
        clearProjectMotion();
        await animateProject(projectCopy, [{ opacity: 1 }, { opacity: 0 }], { duration: 100 });
        if (request !== projectRequest || projectClosing) return;
        paintProject(project, source);
        $(".project-layout", projectDialog).scrollTop = 0;
        $("#project-title").focus({ preventScroll: true });
        const offset = Number(button.dataset.projectStep) * 14;
        animateProject(projectImage, [{ opacity: .3, transform: `translateX(${offset}px) scale(1.015)` }, { opacity: 1, transform: "none" }], { duration: 360 });
        animateProject(projectCopy, [{ opacity: 0, transform: `translateX(${offset}px)` }, { opacity: 1, transform: "none" }], { duration: 300 });
      } finally {
        if (request === projectRequest) projectShell.removeAttribute("aria-busy");
      }
    });
  });
  reducedMotion.addEventListener("change", () => {
    if (reducedMotion.matches) clearProjectMotion();
  });
  window.addEventListener("resize", () => {
    if (projectDialog?.open) clearProjectMotion();
  });

  $$("[data-project]").forEach((trigger) => {
    trigger.addEventListener("click", async () => {
      const originalLabel = trigger.getAttribute("aria-label");
      trigger.setAttribute("aria-busy", "true");
      try {
        await revealProject(trigger);
      } catch {
        const notice = document.createElement("p");
        notice.className = "project-error";
        notice.setAttribute("role", "status");
        notice.textContent = text("This study could not be loaded. Please try again.", "Δεν ήταν δυνατή η φόρτωση της μελέτης. Δοκιμάστε ξανά.");
        if (!trigger.closest("article").querySelector(".project-error")) {
          trigger.closest("article").append(notice);
        }
      } finally {
        trigger.removeAttribute("aria-busy");
        if (originalLabel) trigger.setAttribute("aria-label", originalLabel);
      }
    });
  });

  const serviceItems = $$(".service-item");
  const serviceVisual = $(".service-visual");
  const closeTimers = new WeakMap();
  let previewRequest = 0;

  function finishClosing(item) {
    clearTimeout(closeTimers.get(item));
    closeTimers.delete(item);
    if (!item.classList.contains("is-expanded")) item.open = false;
  }

  function setServiceExpanded(item, expanded) {
    if (item.classList.contains("is-expanded") === expanded) return;
    clearTimeout(closeTimers.get(item));
    closeTimers.delete(item);
    const panel = $(".service-panel", item);
    if (expanded) {
      item.open = true;
      // Establish the collapsed grid before changing its target, including
      // when a just-closing panel is selected again.
      panel.getBoundingClientRect();
    }
    $("summary", item).setAttribute("aria-expanded", String(expanded));
    panel.inert = !expanded;
    panel.setAttribute("aria-hidden", String(!expanded));
    item.classList.toggle("is-expanded", expanded);
    if (!expanded) {
      if (reducedMotion.matches) finishClosing(item);
      else closeTimers.set(item, setTimeout(() => finishClosing(item), 450));
    }
  }

  async function updateServicePreview(item, index) {
    const request = ++previewRequest;
    const frame = serviceVisual && $(".service-image-frame", serviceVisual);
    if (!frame) return;
    const current = $("img.is-current", frame);
    const source = "/assets/images/" + item.dataset.image;
    if (current && current.getAttribute("src") === source) return;
    const incoming = new Image();
    incoming.alt = item.dataset.alt;
    incoming.decoding = "async";
    incoming.classList.toggle("artwork", item.dataset.artwork === "true");
    incoming.src = source;
    try {
      await incoming.decode();
    } catch {
      // Keep the last complete image and its caption if the next image fails.
      return;
    }
    if (request !== previewRequest) return;
    const outgoing = $$("img", frame);
    frame.append(incoming);
    incoming.getBoundingClientRect();
    outgoing.forEach((image) => image.classList.remove("is-current"));
    incoming.classList.add("is-current");
    $("figcaption span", serviceVisual).textContent = $("summary", item).textContent.trim();
    $("#service-image-caption").textContent = item.dataset.caption;
    let cleanupTimer;
    const cleanup = () => {
      clearTimeout(cleanupTimer);
      outgoing.forEach((image) => image.remove());
      incoming.removeEventListener("transitionend", onTransitionEnd);
    };
    const onTransitionEnd = (event) => {
      if (event.propertyName === "opacity") cleanup();
    };
    if (reducedMotion.matches) cleanup();
    else {
      incoming.addEventListener("transitionend", onTransitionEnd);
      cleanupTimer = setTimeout(cleanup, 400);
    }
  }

  serviceItems.forEach((item, index) => {
    const summary = $("summary", item);
    const panel = $(".service-panel", item);
    const expanded = item.open;
    item.classList.add("is-enhanced");
    item.classList.toggle("is-expanded", expanded);
    summary.setAttribute("aria-expanded", String(expanded));
    panel.inert = !expanded;
    panel.setAttribute("aria-hidden", String(!expanded));
    panel.addEventListener("transitionend", (event) => {
      if (event.target === panel && event.propertyName === "grid-template-rows") finishClosing(item);
    });
    summary.addEventListener("click", (event) => {
      event.preventDefault();
      if (item.classList.contains("is-expanded")) return;
      serviceItems.forEach((other) => setServiceExpanded(other, other === item));
      updateServicePreview(item, index);
    });
  });
  reducedMotion.addEventListener("change", (event) => {
    if (event.matches) serviceItems.forEach(finishClosing);
  });
  if ("IntersectionObserver" in window && !reducedMotion.matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    $$(".reveal").forEach((element) => observer.observe(element));
  }
})();
