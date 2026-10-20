import "./css/main.css";

import navbarHtml from "./sections/navbar/navbar.html?raw";
import heroHtml from "./sections/hero/hero.html?raw";
import servicesHtml from "./sections/services/services.html?raw";
import productsHtml from "./sections/products/products.html?raw";
import trainingHtml from "./sections/training/training.html?raw";
import whyChooseWaveHtml from "./sections/why-choose-wave/why-choose-wave.html?raw";
import footerHtml from "./sections/footer/footer.html?raw";

import { initProducts } from "./sections/products/products.js";
import { initTraining } from "./sections/training/training.js";
import { initWhyChooseWave } from "./sections/why-choose-wave/why-choose-wave.js";
import { initFooter } from "./sections/footer/footer.js";

/* ==========================================
   SECTION LOADER
========================================== */

function loadSection(id, html) {
    const container = document.getElementById(id);

    if (!container) {
        console.error(`Section container #${id} not found.`);
        return false;
    }

    container.innerHTML = html;

    return true;
}

/* ==========================================
   LOAD PAGE SECTIONS
========================================== */

loadSection("navbar", navbarHtml);
loadSection("hero", heroHtml);
loadSection("services", servicesHtml);
loadSection("products", productsHtml);
loadSection("training-section", trainingHtml);
loadSection("why-choose-wave", whyChooseWaveHtml);
loadSection("footer-container", footerHtml);
/*
   All section HTML has now been inserted.

   Initialize section-specific interactions only
   after their HTML exists in the document.
*/

/* ==========================================
   THEME SYSTEM
========================================== */

const themeToggle = document.querySelector(".theme-toggle");

const savedTheme = localStorage.getItem("wave-theme");

const systemPrefersLight = window.matchMedia(
    "(prefers-color-scheme: light)"
).matches;

const initialTheme =
    savedTheme || (systemPrefersLight ? "light" : "dark");

document.documentElement.setAttribute(
    "data-theme",
    initialTheme
);

/* ==========================================
   THEME TOGGLE
========================================== */

if (themeToggle) {
    const updateToggle = () => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        const isLight = currentTheme === "light";

        themeToggle.setAttribute(
            "aria-pressed",
            String(isLight)
        );

        themeToggle.setAttribute(
            "aria-label",
            isLight
                ? "Switch to dark mode"
                : "Switch to light mode"
        );
    };

    updateToggle();

    themeToggle.addEventListener("click", () => {
        const currentTheme =
            document.documentElement.getAttribute("data-theme");

        const newTheme =
            currentTheme === "light" ? "dark" : "light";

        document.documentElement.setAttribute(
            "data-theme",
            newTheme
        );

        localStorage.setItem("wave-theme", newTheme);

        updateToggle();
    });
}

/* ==========================================
   SCROLL REVEAL
========================================== */

function initScrollReveal() {
    const revealElements = document.querySelectorAll(".reveal");

    if (!revealElements.length) return;

    // Show everything if IntersectionObserver is unsupported.
    if (!("IntersectionObserver" in window)) {
        revealElements.forEach((element) => {
            element.classList.add("is-visible");
        });

        return;
    }

    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;

                entry.target.classList.add("is-visible");

                // Reveal each element only once.
                observer.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px",
        }
    );

    revealElements.forEach((element) => {
        revealObserver.observe(element);
    });
}

/* ==========================================
   SERVICES EXPANSION
========================================== */

function initServicesExpansion() {
    const serviceCards =
        document.querySelectorAll(".service-card");

    if (!serviceCards.length) return;

    let activeCard = null;

    /* --------------------------------------
       CLOSE ONE SERVICE
    -------------------------------------- */

    function closeService(card) {
        if (!card) return;

        const trigger =
            card.querySelector(".service-card-main");

        const details =
            card.querySelector(".service-card-details");

        card.classList.remove("is-open");

        if (trigger) {
            trigger.setAttribute("aria-expanded", "false");
        }

        if (details) {
            details.setAttribute("aria-hidden", "true");
        }

        if (activeCard === card) {
            activeCard = null;
        }
    }

    /* --------------------------------------
       OPEN ONE SERVICE
    -------------------------------------- */

    function openService(card) {
        const trigger =
            card.querySelector(".service-card-main");

        const details =
            card.querySelector(".service-card-details");

        if (!trigger || !details) return;

        // Close every other card.
        serviceCards.forEach((otherCard) => {
            if (otherCard !== card) {
                closeService(otherCard);
            }
        });

        // Open selected card.
        card.classList.add("is-open");

        trigger.setAttribute("aria-expanded", "true");
        details.setAttribute("aria-hidden", "false");

        activeCard = card;

        // Bring the opened card into a comfortable position.
        setTimeout(() => {
            const top =
                card.getBoundingClientRect().top +
                window.scrollY -
                100;

            window.scrollTo({
                top,
                behavior: "smooth",
            });
        }, 180);
    }

    /* --------------------------------------
       CARD EVENTS
    -------------------------------------- */

    serviceCards.forEach((card) => {
        const trigger =
            card.querySelector(".service-card-main");

        if (!trigger) return;

        trigger.addEventListener("click", () => {
            const isOpen = card.classList.contains("is-open");

            if (isOpen) {
                closeService(card);
            } else {
                openService(card);
            }
        });

        /*
           Native buttons already support Enter and Space.
           The click handler above handles their activation.
        */
    });

    /* --------------------------------------
       ESCAPE KEY
    -------------------------------------- */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && activeCard) {
            closeService(activeCard);
        }
    });
}

/* ==========================================
   INITIALIZE APPLICATION
========================================== */

initScrollReveal();

initServicesExpansion();

initProducts();

initTraining();

initWhyChooseWave();

initFooter();

console.log("🌊 Wave Technology Hub initialized.");