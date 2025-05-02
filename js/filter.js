const filterButtons = document.querySelectorAll(".doc-filter-btn");
const cards = document.querySelectorAll(".doc-card");
const container = document.querySelector(".doc-card-container");

function flipAnimation(callback) {
    const firstRects = new Map();

    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        firstRects.set(card, rect);
    });

    callback(); // on applique les changements

    requestAnimationFrame(() => {
        cards.forEach(card => {
            const firstRect = firstRects.get(card);
            const lastRect = card.getBoundingClientRect();

            const dx = firstRect.left - lastRect.left;
            const dy = firstRect.top - lastRect.top;

            card.animate(
                [
                    {
                        transform: 'translate(0, 0) scale(1.02)', // plus gros
                        opacity: 1,
                        offset: 0.6
                    },
                    {
                        transform: 'translate(0, 0) scale(0.97)', // petit retour en arrière (rebond)
                        opacity: 1,
                        offset: 0.85
                    },
                    {
                        transform: 'translate(0, 0) scale(1)', // taille normale
                        opacity: 1
                    }
                ],
                {
                    duration: 600,
                    easing: 'ease-out'
                }
            );
        });
    });
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        filterButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");

        const category = button.dataset.category;

        flipAnimation(() => {
            cards.forEach(card => {
                const isVisible = (category === "all" || card.dataset.category === category);

                if (isVisible) {
                    card.style.display = "flex";

                    // Forcer reflow pour redémarrer l’animation
                    void card.offsetWidth;

                    // Ajouter l'animation d'apparition
                    card.classList.add("animate-in");

                    // Retirer la classe après l'animation
                    setTimeout(() => {
                        card.classList.remove("animate-in");
                    }, 400); // durée de l'animation
                } else {
                    card.style.display = "none";
                }
            });
        });

    });
});
