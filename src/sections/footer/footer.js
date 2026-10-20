/* =========================================================
   1. FOOTER INITIALIZATION
========================================================= */

export function initFooter() {
    const footer = document.querySelector(".wave-footer");
    if (!footer || footer.dataset.initialized === "true") {
        return;
    }
    footer.dataset.initialized = "true";
    initCopyrightYear();
    initFooterReveal(footer);
    initHeadlineTransformation(footer);
}


/* =========================================================
   2. AUTOMATIC COPYRIGHT YEAR
========================================================= */
function initCopyrightYear() {
    const yearElement = document.getElementById("wave-footer-year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/* =========================================================
   3. SCROLL-TRIGGERED FOOTER REVEAL
========================================================= */
function initFooterReveal(footer) {
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /*
       If motion is disabled or IntersectionObserver is unavailable,
       keep everything visible instead of hiding important content.
    */

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        footer.classList.add("is-footer-visible");
        return;
    }
    /*
       Prepare the CSS reveal states only after the observer
       is ready. This prevents the footer from remaining invisible
       if JavaScript fails before initialization.
    */

    footer.classList.add("footer-reveal-ready");
    const revealObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }
                footer.classList.add("is-footer-visible");

                /*
                   Reveal the footer once.
                   Scrolling away will not repeatedly replay it.
                */

                observer.unobserve(footer);
            });
        },
        {
            threshold: 0.08,
            rootMargin: "0px 0px -5% 0px"
        }
    );
    revealObserver.observe(footer);
}

/* =========================================================
   4. HEADLINE TRANSFORMATION
========================================================= */
function initHeadlineTransformation(footer) {
    const headline = footer.querySelector(
        ".wave-footer__headline-text"
    );
    const cta = footer.querySelector(
        ".wave-footer__cta"
    );
    if (!headline || !cta) {
        return;
    }
    const phrases = [
        "Starts Here.",
        "Moves With WAVE.",
        "Knows No Limits.",
        "The Future Is Yours."
    ];
    const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    /*
       Start with a complete, readable phrase.
       No animation is required for the message to make sense.
    */

    headline.textContent = phrases[0];

    if (
        reducedMotion ||
        !("IntersectionObserver" in window)
    ) {
        return;
    }

    let phraseIndex = 0;
    let animationStarted = false;
    let animationTimer = null;
    let isPageVisible = !document.hidden;
    const showPhrase = (nextIndex) => {
        headline.classList.remove("is-arriving");
        headline.classList.add("is-transforming");
        /*
           Let the outgoing phrase dissolve before replacing it.
        */

        window.setTimeout(() => {
            phraseIndex = nextIndex;

            headline.textContent = phrases[phraseIndex];

            headline.classList.remove("is-transforming");
            headline.classList.add("is-arriving");

            /*
               Remove the arrival state after its animation finishes.
               This keeps the element ready for its next transformation.
            */

            window.setTimeout(() => {
                headline.classList.remove("is-arriving");
            }, 600);
        }, 320);
    };

    const scheduleNextPhrase = () => {
        window.clearTimeout(animationTimer);
        if (!animationStarted || !isPageVisible) {
            return;
        }
        /*
           Give each phrase time to be read before transforming it.
        */

        animationTimer = window.setTimeout(() => {
            const nextIndex = (phraseIndex + 1) % phrases.length;

            showPhrase(nextIndex);
            scheduleNextPhrase();
        }, 3200);
    };
    /*
       Pause the cycle in background tabs.
       Browsers already throttle hidden-page timers, but we can
       avoid doing unnecessary work entirely.
    */

    document.addEventListener("visibilitychange", () => {
        isPageVisible = !document.hidden;
        if (!isPageVisible) {
            window.clearTimeout(animationTimer);
            return;
        }
        if (animationStarted) {
            scheduleNextPhrase();
        }
    });

    /*
       Start the headline only when the CTA itself enters view.
       The rest of the footer does not need to be fully visible.
    */

    const headlineObserver = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting || animationStarted) {
                    return;
                }
                animationStarted = true;
                observer.unobserve(cta);
                /*
                   Let the initial phrase settle before the first
                   transformation begins.
                */

                animationTimer = window.setTimeout(() => {
                    showPhrase(1);
                    scheduleNextPhrase();
                }, 2200);
            });
        },
        {
            threshold: 0.3
        }
    );

    headlineObserver.observe(cta);
}
