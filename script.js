document.addEventListener("DOMContentLoaded", function() {
    // 1. Respaldo Automático de Imágenes (Fallback sin bucles de carga)
    const images = document.querySelectorAll("img.fallback-img");
    images.forEach(img => {
        img.onerror = function() {
            const defaultSrc = img.getAttribute("data-default");
            if (defaultSrc && img.src !== defaultSrc) {
                img.src = defaultSrc;
            }
        };
    });

    // 2. Sistema de Promociones Mensuales Dinámicas
    const fechaActual = new Date();
    const mesActual = fechaActual.getMonth(); 

    const promocionesMes = {
        // Ejemplo Noviembre (Mes 10)
        10: {
            titulo: "¡Especial de Temporada en Planchado!",
            descripcion: "Este mes tráenos tus abrigos y trajes con un 10% de descuento en el planchado por pieza."
        },
    };

    const promoContainer = document.getElementById("promoContainer");
    if (promocionesMes[mesActual]) {
        promoContainer.innerHTML = `
            <div class="promo-active">
                <h3><i class="fas fa-tag"></i> ${promocionesMes[mesActual].titulo}</h3>
                <p>${promocionesMes[mesActual].descripcion}</p>
            </div>
        `;
    } else {
        promoContainer.innerHTML = `
            <div class="promo-none">
                <i class="fas fa-hourglass-half"></i> Próximamente nuevas promociones y descuentos especiales para ti.
            </div>
        `;
    }
});

// 3. Envío de Formulario por WhatsApp
function enviarWhatsApp(event) {
    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefono = document.getElementById("telefono").value.trim();
    const detalles = document.getElementById("detalles").value.trim();

    const numeroWhatsApp = "525636705013";

    const mensaje = `Hola, me gustaría solicitar recolección de ropa para *La Planchita*:%0A` +
                    `- *Nombre:* ${nombre}%0A` +
                    `- *Email:* ${email}%0A` +
                    `- *Teléfono:* ${telefono}%0A` +
                    `- *Detalles/Prendas:* ${detalles}`;

    const url = `https://wa.me/${numeroWhatsApp}?text=${mensaje}`;
    window.open(url, '_blank');
}

// 4. Modales Legales
function abrirModal(tipo) {
    const modal = document.getElementById("legalModal");
    const modalBody = document.getElementById("modalBody");

    if (tipo === 'terminos') {
        modalBody.innerHTML = `
            <h2>Términos y Condiciones</h2>
            <p style="margin-top: 15px;">Bienvenido a <strong>La Planchita</strong>. Al utilizar nuestros servicios de planchado profesional en Peralvillo, aceptas los siguientes términos:</p>
            <ul style="margin-left: 20px; margin-top: 10px; color: #555;">
                <li>La revisión de prendas se realiza al momento de la recepción para detectar detalles previos.</li>
                <li>No nos hacemos responsables por artículos dejados en las bolsas de las prendas.</li>
                <li>Los plazos de entrega estándar y urgentes se comunican de acuerdo con el volumen de ropa.</li>
            </ul>
        `;
    } else if (tipo === 'privacidad') {
        modalBody.innerHTML = `
            <h2>Política de Privacidad</h2>
            <p style="margin-top: 15px;">En <strong>La Planchita</strong> protegemos tus datos personales (nombre, teléfono y correo electrónico) recabados mediante nuestros formularios de contacto y WhatsApp.</p>
            <p style="margin-top: 10px; color: #555;">Dicha información es utilizada única y exclusivamente para gestionar la recolección, seguimiento y entrega de tus servicios de planchado, sin compartir datos con terceros.</p>
        `;
    }

    modal.style.display = "block";
}

function cerrarModal() {
    document.getElementById("legalModal").style.display = "none";
}

window.onclick = function(event) {
    const modal = document.getElementById("legalModal");
    if (event.target == modal) {
        modal.style.display = "none";
    }
}