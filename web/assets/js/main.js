/**
 * DO San Diego - Frontend Interactive Behavior
 */

document.addEventListener("DOMContentLoaded", () => {
  // Filter tag pills toggle interaction
  const pills = document.querySelectorAll(".pill-tag");
  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((p) => p.classList.remove("active"));
      pill.classList.add("active");
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
          });
        }
      }
    });
  });

  // -----------------------------------------------------------------
  // "Eat" restaurant slider â€” draggable, with progress bar + keyboard nav
  // -----------------------------------------------------------------
  (function initEatSlider() {
    const slider = document.querySelector(".main-wrap-slider");
    const progressBarContainer = document.querySelector(".progress-bar");
    const progressBar = document.querySelector(".progress-bar .bar");

    if (!slider || !progressBar) return;

    const originalSlides = Array.from(slider.querySelectorAll(".slide-wrap"));
    const N = originalSlides.length;
    if (!N) return;

    if (progressBarContainer) {
      progressBarContainer.style.width = "440px";
    }

    const beforeFrag = document.createDocumentFragment();
    const afterFrag = document.createDocumentFragment();

    originalSlides.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      beforeFrag.appendChild(clone);
    });
    originalSlides.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      afterFrag.appendChild(clone);
    });

    slider.insertBefore(beforeFrag, slider.firstChild);
    slider.appendChild(afterFrag);

    const slides = Array.from(slider.querySelectorAll(".slide-wrap"));
    const REAL_START = N;

    slides.forEach((slide) => {
      slide.querySelectorAll("img").forEach((img) => {
        img.setAttribute("draggable", "false");
        img.style.userSelect = "none";
        img.style.webkitUserDrag = "none";
      });
      slide.addEventListener("dragstart", (e) => e.preventDefault());
    });

    slider.style.userSelect = "none";
    slider.style.webkitUserSelect = "none";

    let currentIndex = REAL_START;
    let startX = 0;
    let currentX = 0;
    let startTranslate = 0;
    let isDragging = false;
    let didDrag = false;
    let resizeTimeout;
    let hasSetInitialFill = false;

    function getSlidesToShow() {
      if (window.innerWidth < 767) return 1;
      if (window.innerWidth < 992) return 2;
      return 3;
    }

    function getSlideWidth() {
      const containerWidth = slider.parentElement.offsetWidth;
      return containerWidth / getSlidesToShow();
    }

    function normalizeIndex(idx) {
      while (idx < REAL_START) idx += N;
      while (idx >= REAL_START + N) idx -= N;
      return idx;
    }

    function updateProgress() {
      if (!hasSetInitialFill) {
        progressBar.style.width = "20%";
        hasSetInitialFill = true;
        return;
      }
      const cyclic = (((currentIndex - REAL_START) % N) + N) % N;
      const progress = ((cyclic + 1) / N) * 100;
      progressBar.style.width = progress + "%";
    }

    function updateActiveSlide() {
      const slidesToShow = getSlidesToShow();
      const centerOffset = Math.floor((slidesToShow - 1) / 2);
      const activeIndex = currentIndex + centerOffset;

      slides.forEach((slide, idx) => {
        slide.classList.toggle("active-slide", idx === activeIndex);
      });

      const activeTitleEl = document.getElementById("eatActiveTitle");
      if (activeTitleEl) {
        const activeSlide = slides[activeIndex];
        const titleEl = activeSlide ? activeSlide.querySelector("h5") : null;
        const img = activeSlide ? activeSlide.querySelector("img") : null;
        const titleText =
          (titleEl && titleEl.textContent.trim()) ||
          (img && img.getAttribute("alt")) ||
          "Restaurants";
        activeTitleEl.textContent = titleText;
      }
    }

    function moveSlider(animate = true) {
      const slideWidth = getSlideWidth();
      slider.style.transition = animate
        ? "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        : "none";
      slider.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
      updateProgress();
      updateActiveSlide();
    }

    function settleAfterTransition() {
      const normalized = normalizeIndex(currentIndex);
      if (normalized !== currentIndex) {
        currentIndex = normalized;
        moveSlider(false);
      }
    }

    slider.addEventListener("transitionend", function (e) {
      if (e.propertyName !== "transform") return;
      settleAfterTransition();
    });

    function goTo(index, animate = true) {
      currentIndex = index;
      moveSlider(animate);
      if (!animate) settleAfterTransition();
    }

    function dragStart(e) {
      isDragging = true;
      didDrag = false;
      slider.classList.add("is-dragging");

      const clientX = e.type.includes("mouse")
        ? e.clientX
        : e.touches[0].clientX;
      startX = clientX;
      currentX = clientX;
      startTranslate = -(currentIndex * getSlideWidth());

      slider.style.transition = "none";

      if (e.type === "mousedown") e.preventDefault();
    }

    function dragMove(e) {
      if (!isDragging) return;

      const clientX = e.type.includes("mouse")
        ? e.clientX
        : e.touches[0].clientX;
      currentX = clientX;

      const diff = currentX - startX;

      if (Math.abs(diff) > 5) didDrag = true;

      slider.style.transition = "none";
      slider.style.transform = `translateX(${startTranslate + diff}px)`;
    }

    function dragEnd() {
      if (!isDragging) return;

      isDragging = false;
      slider.classList.remove("is-dragging");

      const diff = currentX - startX;
      const slideWidth = getSlideWidth();
      const threshold = slideWidth * 0.15;

      if (Math.abs(diff) > threshold) {
        if (diff < 0) {
          goTo(currentIndex + 1);
        } else {
          goTo(currentIndex - 1);
        }
      } else {
        moveSlider(true);
      }

      startX = 0;
      currentX = 0;
    }

    slider.addEventListener(
      "click",
      function (e) {
        if (didDrag) {
          e.preventDefault();
          e.stopPropagation();
          didDrag = false;
        }
      },
      true,
    );

    slider.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);

    slider.addEventListener("touchstart", dragStart, { passive: true });
    slider.addEventListener("touchmove", dragMove, { passive: true });
    slider.addEventListener("touchend", dragEnd);
    slider.addEventListener("touchcancel", dragEnd);

    window.addEventListener("resize", function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        currentIndex = normalizeIndex(currentIndex);
        moveSlider(false);
      }, 200);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") {
        goTo(currentIndex - 1, true);
      } else if (e.key === "ArrowRight") {
        goTo(currentIndex + 1, true);
      }
    });

    moveSlider(false);
  })();

  // -----------------------------------------------------------------
  // "Where to Stay" Prev/Next Slider Control Logic
  // -----------------------------------------------------------------

  (function initStaySlider() {
    const stayTrack = document.getElementById("stayCarouselTrack");
    const stayPrev = document.getElementById("stayPrevBtn");
    const stayNext = document.getElementById("stayNextBtn");

    if (!stayTrack || !stayPrev || !stayNext) return;

    const originalCards = Array.from(
      stayTrack.querySelectorAll(".stay-card-item"),
    );
    const N = originalCards.length;
    if (!N) return;

    const GAP = 24;

    const beforeFrag = document.createDocumentFragment();
    const afterFrag = document.createDocumentFragment();

    originalCards.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      beforeFrag.appendChild(clone);
    });
    originalCards.forEach((node) => {
      const clone = node.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      afterFrag.appendChild(clone);
    });

    stayTrack.insertBefore(beforeFrag, stayTrack.firstChild);
    stayTrack.appendChild(afterFrag);

    const cards = Array.from(stayTrack.querySelectorAll(".stay-card-item"));
    const REAL_START = N;

    cards.forEach((card) => {
      card.querySelectorAll("img").forEach((img) => {
        img.setAttribute("draggable", "false");
        img.style.webkitUserDrag = "none";
      });
      card.addEventListener("dragstart", (e) => e.preventDefault());
    });
    stayTrack.style.userSelect = "none";
    stayTrack.style.webkitUserSelect = "none";

    let currentIndex = REAL_START;
    let isAnimating = false;

    let isDragging = false;
    let didDrag = false;
    let startX = 0;
    let currentX = 0;
    let startTranslate = 0;

    function getSlidesToShow() {
      if (window.innerWidth <= 575) return 1;
      if (window.innerWidth <= 991) return 2;
      return 3;
    }

    function getCardWidth() {
      const slidesToShow = getSlidesToShow();
      const containerWidth = stayTrack.parentElement.offsetWidth;
      const totalGap = GAP * (slidesToShow - 1);
      return (containerWidth - totalGap) / slidesToShow;
    }

    function applyCardWidths() {
      const cardWidth = getCardWidth();
      cards.forEach((card) => {
        card.style.flex = `0 0 ${cardWidth}px`;
        card.style.width = `${cardWidth}px`;
        card.style.marginRight = `${GAP}px`;
      });
      return cardWidth;
    }

    function normalizeIndex(idx) {
      while (idx < REAL_START) idx += N;
      while (idx >= REAL_START + N) idx -= N;
      return idx;
    }

    function moveSlider(animate = true) {
      const cardWidth = applyCardWidths();
      const step = cardWidth + GAP;
      stayTrack.style.transition = animate
        ? "transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
        : "none";
      stayTrack.style.transform = `translateX(-${currentIndex * step}px)`;
    }

    function settleAfterTransition() {
      const normalized = normalizeIndex(currentIndex);
      if (normalized !== currentIndex) {
        currentIndex = normalized;
        moveSlider(false);
      }
      isAnimating = false;
    }

    stayTrack.addEventListener("transitionend", function (e) {
      if (e.propertyName !== "transform") return;
      settleAfterTransition();
    });

    function goTo(index) {
      if (isAnimating) return;
      isAnimating = true;
      currentIndex = index;
      moveSlider(true);
    }

    stayPrev.addEventListener("click", () => {
      goTo(currentIndex - 1);
    });

    stayNext.addEventListener("click", () => {
      goTo(currentIndex + 1);
    });

    function dragStart(e) {
      if (isAnimating) return;
      isDragging = true;
      didDrag = false;
      stayTrack.classList.add("is-dragging");

      const clientX = e.type.includes("mouse")
        ? e.clientX
        : e.touches[0].clientX;
      startX = clientX;
      currentX = clientX;

      const step = getCardWidth() + GAP;
      startTranslate = -(currentIndex * step);

      stayTrack.style.transition = "none";

      if (e.type === "mousedown") e.preventDefault();
    }

    function dragMove(e) {
      if (!isDragging) return;

      const clientX = e.type.includes("mouse")
        ? e.clientX
        : e.touches[0].clientX;
      currentX = clientX;

      const diff = currentX - startX;
      if (Math.abs(diff) > 5) didDrag = true;

      stayTrack.style.transition = "none";
      stayTrack.style.transform = `translateX(${startTranslate + diff}px)`;
    }

    function dragEnd() {
      if (!isDragging) return;
      isDragging = false;
      stayTrack.classList.remove("is-dragging");

      const diff = currentX - startX;
      const step = getCardWidth() + GAP;
      const threshold = step * 0.2;

      if (Math.abs(diff) > threshold) {
        if (diff < 0) {
          goTo(currentIndex + 1);
        } else {
          goTo(currentIndex - 1);
        }
      } else {
        moveSlider(true);
      }

      startX = 0;
      currentX = 0;
    }

    stayTrack.addEventListener(
      "click",
      function (e) {
        if (didDrag) {
          e.preventDefault();
          e.stopPropagation();
          didDrag = false;
        }
      },
      true,
    );

    stayTrack.addEventListener("mousedown", dragStart);
    document.addEventListener("mousemove", dragMove);
    document.addEventListener("mouseup", dragEnd);

    stayTrack.addEventListener("touchstart", dragStart, { passive: true });
    stayTrack.addEventListener("touchmove", dragMove, { passive: true });
    stayTrack.addEventListener("touchend", dragEnd);
    stayTrack.addEventListener("touchcancel", dragEnd);

    let resizeTimeout;
    window.addEventListener("resize", function () {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        currentIndex = normalizeIndex(currentIndex);
        moveSlider(false);
      }, 200);
    });

    moveSlider(false);
  })();

  // -----------------------------------------------------------------
  // "What To Do" Category Slider Prev/Next Control Logic
  // -----------------------------------------------------------------

  const todoTrack = document.getElementById("todoCarouselTrack");
  const todoPrev = document.getElementById("todoPrevBtn");
  const todoNext = document.getElementById("todoNextBtn");

  if (todoTrack && todoPrev && todoNext) {
    const todoCards = Array.from(todoTrack.querySelectorAll(".todo-card-item"));
    let currentTodoIndex = 0;

    function updateTodoSlider() {
      if (todoCards.length === 0) return;
      const maxIndex = Math.max(0, todoCards.length - 3);
      if (currentTodoIndex < 0) currentTodoIndex = 0;
      if (currentTodoIndex > maxIndex) currentTodoIndex = maxIndex;

      const cardWidth = todoCards[0].offsetWidth + 24;
      todoTrack.style.transform = `translateX(-${currentTodoIndex * cardWidth}px)`;
    }

    todoPrev.addEventListener("click", () => {
      if (currentTodoIndex > 0) {
        currentTodoIndex--;
        updateTodoSlider();
      }
    });

    todoNext.addEventListener("click", () => {
      const maxIndex = Math.max(0, todoCards.length - 3);
      if (currentTodoIndex < maxIndex) {
        currentTodoIndex++;
        updateTodoSlider();
      }
    });
  }

  // -----------------------------------------------------------------
  // Mobile nav slide-in toggle (open + close)
  // Replaces the old single toggle-class listener â€” that version
  // conflicted with this one, since both would fire on click and
  // cancel each other out.
  // -----------------------------------------------------------------

  // Open: wire up any button with data-toggle="slide-left" to its data-target
  // Open: wire up any button with data-toggle="slide-left" to its data-target
  document
    .querySelectorAll('[data-toggle="slide-left"]')
    .forEach(function (toggler) {
      toggler.addEventListener("click", function () {
        const targetSelector = toggler.getAttribute("data-target");
        const target = document.querySelector(targetSelector);
        if (!target) return;

        const isOpen = target.classList.contains("slide-left");
        target.classList.toggle("slide-left");
        toggler.setAttribute("aria-expanded", String(!isOpen));
      });
    });

  // Close: overlay click, .close-btn-cont click (and any .slide-close-button button, if present)
  document
    .querySelectorAll(
      ".slide-close-button button, .bg-overlay, .close-btn-cont",
    )
    .forEach(function (element) {
      element.addEventListener("click", function () {
        document.querySelector(".slide-nav").classList.remove("slide-left");

        const toggler = document.querySelector('[data-toggle="slide-left"]');
        if (toggler) toggler.setAttribute("aria-expanded", "false");
      });
    });

  // submenu
  (function initMobileSubmenu() {
    const submenuTogglers = document.querySelectorAll(".hdr-menu-link");

    if (!submenuTogglers.length) return;

    submenuTogglers.forEach((toggler) => {
      toggler.addEventListener("click", function () {
        const isAlreadyActive = toggler.classList.contains("active");

        // Close all togglers + their submenus first
        submenuTogglers.forEach((otherToggler) => {
          otherToggler.classList.remove("active");
          const otherSubmenu = otherToggler.nextElementSibling;
          if (
            otherSubmenu &&
            otherSubmenu.classList.contains("sub-menu-cont")
          ) {
            otherSubmenu.style.maxHeight = null;
          }
        });

        // If it wasn't already open, open this one
        if (!isAlreadyActive) {
          toggler.classList.add("active");
          const submenu = toggler.nextElementSibling;
          if (submenu && submenu.classList.contains("sub-menu-cont")) {
            submenu.style.maxHeight = submenu.scrollHeight + "px";
          }
        }
      });
    });
  })();
});
