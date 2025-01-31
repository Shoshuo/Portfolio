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