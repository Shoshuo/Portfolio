/* =====================================================
   Modals — projet cards + PDF (documents.html)
   ===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ── Projet modals ─────────────────────────────── */
    var overlay = document.querySelector("[data-overlay]");

    if (overlay) {

        function closeAll() {
            document.querySelectorAll(".modal.active, .proj-modal.active").forEach(function (m) {
                m.classList.remove("active");
            });
            overlay.classList.remove("active");
            document.body.classList.remove("modal-open");
        }

        // Ouvrir
        document.querySelectorAll("[data-open-modal]").forEach(function (btn) {
            btn.addEventListener("click", function () {
                var id    = this.getAttribute("data-open-modal");
                var modal = document.querySelector('[data-modal="' + id + '"]');
                if (modal) {
                    modal.classList.add("active");
                    overlay.classList.add("active");
                    document.body.classList.add("modal-open");
                }
            });
        });

        // Fermer via bouton ×
        document.querySelectorAll("[data-close-modal]").forEach(function (btn) {
            btn.addEventListener("click", function (e) {
                e.stopPropagation();
                var id    = this.getAttribute("data-close-modal");
                var modal = document.querySelector('[data-modal="' + id + '"]');
                if (modal) {
                    modal.classList.remove("active");
                    overlay.classList.remove("active");
                    document.body.classList.remove("modal-open");
                }
            });
        });

        // Fermer en cliquant sur l'overlay (legacy .modal)
        overlay.addEventListener("click", closeAll);

        // Fermer avec Escape
        document.addEventListener("keydown", function (e) {
            if (e.key === "Escape") closeAll();
        });
    }

    // Fermer .proj-modal en cliquant sur le backdrop (hors inner box)
    document.querySelectorAll(".proj-modal").forEach(function (modal) {
        modal.addEventListener("click", function (e) {
            if (e.target === modal) {
                modal.classList.remove("active");
                document.body.classList.remove("modal-open");
            }
        });
        var inner = modal.querySelector(".proj-modal-inner");
        if (inner) {
            inner.addEventListener("click", function (e) {
                e.stopPropagation();
            });
        }
    });

    /* ── PDF modals (documents.html uniquement) ─────── */
    var openPdf    = document.getElementById("openModalPdf");
    var closePdf   = document.getElementById("closeModalPdf");
    var overlayPdf = document.getElementById("overlayPdf");
    var modalPdf   = document.getElementById("modalPdf");

    if (openPdf && modalPdf && overlayPdf) {
        openPdf.addEventListener("click", function (e) {
            e.preventDefault();
            modalPdf.classList.add("active");
            overlayPdf.classList.add("active");
        });
        if (closePdf) {
            closePdf.addEventListener("click", function () {
                modalPdf.classList.remove("active");
                overlayPdf.classList.remove("active");
            });
        }
        overlayPdf.addEventListener("click", function () {
            modalPdf.classList.remove("active");
            overlayPdf.classList.remove("active");
        });
    }

    var openPdfT    = document.getElementById("openModalPdfT");
    var closePdfT   = document.getElementById("closeModalPdfT");
    var overlayPdfT = document.getElementById("overlayPdfT");
    var modalPdfT   = document.getElementById("modalPdfT");

    if (openPdfT && modalPdfT && overlayPdfT) {
        openPdfT.addEventListener("click", function (e) {
            e.preventDefault();
            modalPdfT.classList.add("active");
            overlayPdfT.classList.add("active");
        });
        if (closePdfT) {
            closePdfT.addEventListener("click", function () {
                modalPdfT.classList.remove("active");
                overlayPdfT.classList.remove("active");
            });
        }
        overlayPdfT.addEventListener("click", function () {
            modalPdfT.classList.remove("active");
            overlayPdfT.classList.remove("active");
        });
    }

});
