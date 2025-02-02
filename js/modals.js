document.getElementById("openModal").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("modal").classList.add("active");
    document.getElementById("overlay").classList.add("active");
});
document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("modal").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
});
document.getElementById("overlay").addEventListener("click", function() {
    document.getElementById("modal").classList.remove("active");
    document.getElementById("overlay").classList.remove("active");
});

// Modals pour PDF

document.getElementById("openModalPdf").addEventListener("click", function(event) {
    event.preventDefault();
    document.getElementById("modalPdf").classList.add("active");
    document.getElementById("overlayPdf").classList.add("active");
});

document.getElementById("closeModalPdf").addEventListener("click", function() {
    document.getElementById("modalPdf").classList.remove("active");
    document.getElementById("overlayPdf").classList.remove("active");
});

document.getElementById("overlayPdf").addEventListener("click", function() {
    document.getElementById("modalPdf").classList.remove("active");
    document.getElementById("overlayPdf").classList.remove("active");
});