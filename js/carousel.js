const carouselIndexes = {}; // stocke la slide actuelle pour chaque carousel

function moveSlide(projectId, step) {
    const carousel = document.querySelector(`#carousel-project-${projectId} .carousel`);
    const slides = carousel.querySelectorAll('.carousel-slide');

    // Initialisation de l'index si nécessaire
    if (!(projectId in carouselIndexes)) {
        carouselIndexes[projectId] = 0;
    }

    // Supprimer la classe active actuelle
    slides[carouselIndexes[projectId]].classList.remove('active');

    // Calcul du nouvel index
    const totalSlides = slides.length;
    carouselIndexes[projectId] = (carouselIndexes[projectId] + step + totalSlides) % totalSlides;

    // Appliquer la classe active à la nouvelle slide
    slides[carouselIndexes[projectId]].classList.add('active');
}
