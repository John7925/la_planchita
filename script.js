document.addEventListener("DOMContentLoaded", () => {
    const NUMERO_WHATSAPP = "525636705013";

    // ========================================================
    // 1. SISTEMA DE SUSTITUCIÓN VISUAL DE IMÁGENES (Sin errores en consola)
    // ========================================================
    const imagenesDinamicas = document.querySelectorAll("img.img-dinamica");
    
    imagenesDinamicas.forEach((img) => {
        const nombreCliente = img.getAttribute("data-cliente");
        if (nombreCliente) {
            const rutaCliente = `images/images-cliente/${nombreCliente}`;
            
            // Petición silenciosa para verificar si la imagen del cliente existe
            fetch(rutaCliente, { method: 'HEAD' })
                .then(response => {
                    if (response.ok) {
                        img.src = rutaCliente; // Si existe, la cambia
                    }
                })
                .catch(() => {
                    // Si no existe, falla silenciosamente sin arrojar error en consola.
                });
        }
    });

    // 1.1 Sustitución dinámica del fondo Hero (Actualizado a .webp)
    const rutaHeroCliente = "images/images-cliente/hero.webp";
    fetch(rutaHeroCliente, { method: 'HEAD' })
        .then(response => {
            if (response.ok) {
                const heroSection = document.querySelector('.hero');
                if (heroSection) {
                    heroSection.style.backgroundImage = "linear-gradient(rgba(27, 73, 101, 0.88), rgba(44, 62, 80, 0.88)), url('" + rutaHeroCliente + "')";
                }
            }
        })
        .catch(() => {});

    // ========================================================
    // 2. GESTIÓN ACCESIBLE DE MODALES LEGALES
    // ========================================================
    let lastFocusedElement = null;

    function abrirModal(idModal) {
        const modal = document.getElementById(idModal);
        if (!modal) return;

        lastFocusedElement = document.activeElement;
        modal.classList.add("is-open");
        document.body.style.overflow = "hidden";

        const closeBtn = modal.querySelector(".close-modal");
        if (closeBtn) closeBtn.focus();
    }

    function cerrarModal(modal) {
        if (!modal) return;
        modal.classList.remove("is-open");
        document.body.style.overflow = "";

        if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
            lastFocusedElement.focus();
            lastFocusedElement = null;
        }
    }

    document.querySelectorAll("[data-modal]").forEach((btn) => {
        btn.addEventListener("click", () => {
            abrirModal(btn.dataset.modal);
        });
    });

    document.querySelectorAll(".modal").forEach((modal) => {
        const closeBtn = modal.querySelector(".close-modal");
        if (closeBtn) {
            closeBtn.addEventListener("click", () => cerrarModal(modal));
        }

        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                cerrarModal(modal);
            }
        });
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const openModal = document.querySelector(".modal.is-open");
            if (openModal) {
                cerrarModal(openModal);
            }
        }
    });

    // ========================================================
    // 3. VALIDACIÓN Y ENVÍO DE FORMULARIO POR WHATSAPP
    // ========================================================
    const form = document.getElementById("formRecoleccion");
    const formError = document.getElementById("formError");

    if (form) {
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            formError.textContent = "";

            const nombre = document.getElementById("nombre").value.trim();
            const telefono = document.getElementById("telefono").value.trim();
            const direccion = document.getElementById("direccion").value.trim();
            const referencias = document.getElementById("referencias").value.trim() || "Ninguna";
            const servicio = document.getElementById("servicio").value;

            if (!nombre || !telefono || !direccion) {
                formError.textContent = "Por favor completa tu nombre, teléfono y dirección.";
                return;
            }

            const digitosTelefono = telefono.replace(/\D/g, "");
            if (digitosTelefono.length < 10) {
                formError.textContent = "Ingresa un número telefónico válido de al menos 10 dígitos.";
                document.getElementById("telefono").focus();
                return;
            }

            const mensaje =
                `Hola, *La Planchita*. Deseo solicitar una recolección a domicilio:\n\n` +
                `*Nombre:* ${nombre}\n` +
                `*Teléfono:* ${telefono}\n` +
                `*Dirección:* ${direccion}\n` +
                `*Referencias:* ${referencias}\n` +
                `*Servicio:* ${servicio}`;

            const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(mensaje)}`;
            const nuevaVentana = window.open(url, "_blank", "noopener,noreferrer");

            // Respaldo para navegadores móviles integrados (como Facebook o Instagram) que bloquean ventanas emergentes
            if (!nuevaVentana) {
                window.location.href = url;
            }
        });
    }
});