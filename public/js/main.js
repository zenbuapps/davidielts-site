const siteLoader = document.querySelector("[data-site-loader]");
let siteIntroReady = Promise.resolve();

if (siteLoader) {
  siteIntroReady = new Promise((resolve) => {
    const loaderStartedAt = performance.now();
    const minimumLoaderTime = 1100;
    let hasHiddenLoader = false;
    const hideLoader = () => {
      if (hasHiddenLoader) {
        return;
      }

      hasHiddenLoader = true;
      const elapsed = performance.now() - loaderStartedAt;
      const remaining = Math.max(minimumLoaderTime - elapsed, 0);

      window.setTimeout(() => {
        siteLoader.classList.add("is-hiding");
        window.setTimeout(() => {
          siteLoader.remove();
          resolve();
        }, 620);
      }, remaining);
    };

    if (document.readyState === "complete" || document.readyState === "interactive") {
      window.setTimeout(hideLoader, 0);
    } else {
      document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
      window.addEventListener("load", hideLoader, { once: true });
      window.setTimeout(hideLoader, 1800);
    }
  });
}

const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

const currentPage = document.body.dataset.page;
document.querySelectorAll("[data-page-link]").forEach((link) => {
  if (link.dataset.pageLink === currentPage) {
    link.classList.add("is-active");
  }
});

document.querySelectorAll("[data-tabs]").forEach((tabs) => {
  const buttons = tabs.querySelectorAll("[data-tab-button]");
  const panels = tabs.querySelectorAll("[data-tab-panel]");
  const badge = tabs.querySelector("[data-tabs-badge]");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.tabButton;

      buttons.forEach((item) => {
        item.setAttribute("aria-selected", String(item === button));
      });

      panels.forEach((panel) => {
        panel.classList.toggle("is-active", panel.dataset.tabPanel === target);
      });

      if (badge && button.dataset.tabBadge) {
        badge.textContent = button.dataset.tabBadge;
      }
    });
  });
});

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const note = form.querySelector("[data-form-note]");
    if (note) {
      note.classList.add("is-visible");
    }
    form.reset();
  });
});

const cartStorageKey = "aceIeltsCart";
const defaultCartItem = {
  id: "ace-ielts-sprint-2026",
  name: "Ace Your IELTS 雅思衝刺班",
  price: 18000,
  quantity: 1
};
const formatCurrency = (amount) => `NT$${Number(amount || 0).toLocaleString("zh-TW")}`;

document.querySelectorAll("[data-add-to-cart]").forEach((button) => {
  button.addEventListener("click", () => {
    const quantityOutput = button.closest(".enroll-cart-card")?.querySelector("[data-quantity-value]");
    const quantity = Math.max(1, Number(quantityOutput?.value || quantityOutput?.textContent || 1));
    const item = {
      id: button.dataset.productId || defaultCartItem.id,
      name: button.dataset.productName || defaultCartItem.name,
      price: Number(button.dataset.productPrice || defaultCartItem.price),
      quantity
    };

    try {
      window.localStorage.setItem(cartStorageKey, JSON.stringify(item));
    } catch (error) {
      // Cart still works with the default item if storage is unavailable.
    }

    window.location.href = button.dataset.cartUrl || "cart.html";
  });
});

document.querySelectorAll(".enroll-cart-card").forEach((card) => {
  const output = card.querySelector("[data-quantity-value]");
  const decrement = card.querySelector("[data-quantity-decrement]");
  const increment = card.querySelector("[data-quantity-increment]");

  if (!output || !decrement || !increment) {
    return;
  }

  let quantity = Math.max(1, Number(output.value || output.textContent || 1));
  const syncQuantity = () => {
    output.textContent = String(quantity);
    output.value = String(quantity);
    decrement.disabled = quantity <= 1;
  };

  decrement.addEventListener("click", () => {
    quantity = Math.max(1, quantity - 1);
    syncQuantity();
  });

  increment.addEventListener("click", () => {
    quantity += 1;
    syncQuantity();
  });

  syncQuantity();
});

const cartPage = document.querySelector("[data-cart-page]");

if (cartPage) {
  let cartItem = defaultCartItem;

  try {
    const storedCart = window.localStorage.getItem(cartStorageKey);
    if (storedCart) {
      cartItem = { ...defaultCartItem, ...JSON.parse(storedCart) };
    }
  } catch (error) {
    cartItem = defaultCartItem;
  }

  const subtotal = Number(cartItem.price || 0) * Number(cartItem.quantity || 1);
  const cartName = cartPage.querySelector("[data-cart-name]");
  const cartPrice = cartPage.querySelector("[data-cart-price]");
  const cartSubtotal = cartPage.querySelector("[data-cart-subtotal]");
  const cartTotal = cartPage.querySelector("[data-cart-total]");

  if (cartName) {
    cartName.textContent = cartItem.name;
  }

  if (cartPrice) {
    cartPrice.textContent = formatCurrency(cartItem.price);
  }

  if (cartSubtotal) {
    cartSubtotal.textContent = formatCurrency(subtotal);
  }

  if (cartTotal) {
    cartTotal.textContent = formatCurrency(subtotal);
  }
}

const counters = document.querySelectorAll("[data-counter]");

if (counters.length > 0) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const formatNumber = (value, decimals) => {
    return value.toLocaleString("zh-TW", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
  };
  const setCounterValue = (counter, value) => {
    const decimals = Number(counter.dataset.decimals || 0);
    counter.textContent = formatNumber(value, decimals);
  };
  const animateCounter = (counter) => {
    if (counter.dataset.counted === "true") {
      return;
    }

    counter.dataset.counted = "true";
    const target = Number(counter.dataset.count || 0);
    const decimals = Number(counter.dataset.decimals || 0);
    const duration = Number(counter.dataset.duration || 1200);
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;
      counter.textContent = formatNumber(current, decimals);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        counter.textContent = formatNumber(target, decimals);
      }
    };

    requestAnimationFrame(tick);
  };

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    counters.forEach((counter) => {
      setCounterValue(counter, Number(counter.dataset.count || 0));
    });
  } else {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          siteIntroReady.then(() => animateCounter(entry.target));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.45 });

    counters.forEach((counter) => counterObserver.observe(counter));
  }
}
