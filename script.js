document.addEventListener("DOMContentLoaded", () => {
    const NUMERO_WHATSAPP = "525636705013";

    // ========================================================
    // 1. SISTEMA DE SUSTITUCIÓN VISUAL DE IMÁGENES (Cliente > Defaul)
    // ========================================================
    const imagenesDinamicas = document.querySelectorAll("img.img-dinamica");
    
    imagenesDinamicas.forEach((img) => {
        const nombreCliente = img.getAttribute("data-cliente");
        if (nombreCliente) {
            const rutaCliente = `images/images-cliente/${nombreCliente}`;
            const verificador = new Image();
            
            // Si la imagen en la carpeta del cliente existe, sustituye la visual
            verificador.onload = () => {
                img.src = rutaCliente;
            };
            // Si no existe, el navegador ignora la acción y se queda la de images-defaul
            verificador.src = rutaCliente;
        }
    });

    // 1.1 Sustitución dinámica del fondo Hero (hero.jpg)
    const heroVerificador = new Image();
    heroVerificador.onload = () => {
        const heroSection = document.querySelector('.hero');
        if (heroSection) {
            // Mantiene el filtro oscuro y cambia solo la imagen de fondo si el cliente subió una nueva
            heroSection.style.backgroundImage = "linear-gradient(rgba(27, 73, 101, 0.88), rgba(44, 62, 80, 0.88)), url('images/images-cliente/hero.jpg')";
        }
    };
    heroVerificador.src = "images/images-cliente/hero.jpg";


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

            // Respaldo para navegadores móviles que bloquean ventanas emergentes
            if (!nuevaVentana) {
                window.location.href = url;
            }
        });
    }
});