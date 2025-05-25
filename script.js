document.addEventListener("DOMContentLoaded", function () {
  // Menú hamburguesa
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  menuToggle.addEventListener("click", function () {
    this.querySelector("i").classList.toggle("fa-times");
    nav.classList.toggle("active");
  });

  // Cerrar menú al hacer clic en un enlace
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuToggle.querySelector("i").classList.remove("fa-times");
    });
  });

  // Efecto de scroll para el header
  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
  });
});

// Filtrado de proyectos
document.addEventListener("DOMContentLoaded", function () {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  // Función para filtrar proyectos
  function filterProjects(category) {
    projectCards.forEach((card) => {
      const cardCategory = card.dataset.category;

      if (category === "all" || cardCategory === category) {
        card.style.display = "block";
        setTimeout(() => {
          card.style.opacity = "1";
          card.style.transform = "translateY(0)";
        }, 50);
      } else {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        setTimeout(() => {
          card.style.display = "none";
        }, 300);
      }
    });
  }

  // Event listeners para los botones de filtro
  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Remover clase 'active' de todos los botones
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Añadir clase 'active' al botón clickeado
      this.classList.add("active");

      // Filtrar proyectos según la categoría
      const filterValue = this.dataset.filter;
      filterProjects(filterValue);
    });
  });

  // Modal para demos
  const modal = document.getElementById("demo-modal");
  const modalVideo = document.getElementById("modal-video");
  const closeModal = document.querySelector(".close-modal");

  function openModal(videoSrc) {
    modal.style.display = "block";
    modalVideo.src = videoSrc;
    document.body.style.overflow = "hidden"; // Bloquear scroll
  }

  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
    modalVideo.pause();
    document.body.style.overflow = "auto"; // Restaurar scroll
  });

  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      modalVideo.pause();
      document.body.style.overflow = "auto";
    }
  });
});

// Custom cursor
document.addEventListener("DOMContentLoaded", () => {
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  // Mueve el cursor
  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  // Detecta elementos interactivos dinámicamente
  function addHoverEffect() {
    document
      .querySelectorAll("a, button, .btn, input, textarea, [onclick]")
      .forEach((el) => {
        el.addEventListener("mouseenter", () => cursor.classList.add("active"));
        el.addEventListener("mouseleave", () =>
          cursor.classList.remove("active")
        );
      });
  }

  // Ejecuta ahora y cada 2 segundos (por contenido dinámico)
  addHoverEffect();
  setInterval(addHoverEffect, 2000);
});
