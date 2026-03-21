/* =====================================================
   Theme toggle — light / dark mode
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {
    var btns = document.querySelectorAll(".theme-toggle-btn");
    if (!btns.length) return;

    /* Injecte le label si absent */
    btns.forEach(function (btn) {
        if (!btn.querySelector(".theme-toggle-label")) {
            var label = document.createElement("span");
            label.className = "theme-toggle-label";
            btn.appendChild(label);
        }
    });

    function updateIcons() {
        var isDark = document.body.classList.contains("dark-mode");
        btns.forEach(function (btn) {
            var icon  = btn.querySelector("i");
            var label = btn.querySelector(".theme-toggle-label");
            if (icon)  icon.className = isDark ? "fa fa-sun" : "fa fa-moon";
            if (label) label.textContent = isDark ? "Clair" : "Sombre";
            btn.setAttribute("aria-label", isDark ? "Passer en theme clair" : "Passer en theme sombre");
        });
    }

    updateIcons();

    btns.forEach(function (btn) {
        btn.addEventListener("click", function () {
            btn.classList.add("toggling");
            setTimeout(function () { btn.classList.remove("toggling"); }, 500);

            var isDark = document.body.classList.toggle("dark-mode");
            localStorage.setItem("theme", isDark ? "dark" : "light");
            updateIcons();
        });
    });
});
