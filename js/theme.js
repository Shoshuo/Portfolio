/* =====================================================
   Theme toggle — light / dark mode
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    var btns = document.querySelectorAll(".theme-toggle-btn");
    if (!btns.length) return;

    function updateIcons() {
        var isDark = document.body.classList.contains("dark-mode");
        btns.forEach(function (btn) {
            var icon = btn.querySelector("i");
            if (!icon) return;
            icon.className = isDark ? "fa fa-sun" : "fa fa-moon";
        });
    }

    updateIcons();

    btns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            var isDark = document.body.classList.toggle("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateIcons();
        });
    });
});
