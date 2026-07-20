// ===========================
// BERCHKO TOURNAMENT
// main.js
// ===========================

// Smooth fade-in for hero content
window.addEventListener("load", () => {
    const hero = document.querySelector(".hero-content");

    if (hero) {
        hero.style.opacity = "0";
        hero.style.transform = "translateY(30px)";

        setTimeout(() => {
            hero.style.transition = "all 1s ease";
            hero.style.opacity = "1";
            hero.style.transform = "translateY(0)";
        }, 300);
    }
});

// Highlight active navigation link
const currentPage = window.location.pathname.split("/").pop();

document.querySelectorAll(".nav-links a").forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPage || (currentPage === "" && href === "index.html")) {
        link.classList.add("active");
    }
});