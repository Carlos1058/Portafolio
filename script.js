document.addEventListener("DOMContentLoaded", function () {
  // -------------------------------
  // 1. Configuración inicial
  // -------------------------------
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("nav");

  // Menú hamburguesa
  menuToggle.addEventListener("click", function () {
    this.querySelector("i").classList.toggle("fa-times");
    nav.classList.toggle("active");
  });

  // Cerrar menú al hacer clic en enlace
  document.querySelectorAll("nav a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      menuToggle.querySelector("i").classList.remove("fa-times");
    });
  });

  // Header sticky al hacer scroll
  window.addEventListener("scroll", function () {
    const header = document.querySelector("header");
    header.classList.toggle("sticky", window.scrollY > 0);
  });

  // -------------------------------
  // 2. Carga de datos y configuraciones
  // -------------------------------
  loadProjects().then(() => {
    setupProjectFilters();
    setupModal();
  });
  loadEducation();
  loadCertifications();

  // -------------------------------
  // 3. Cursor personalizado
  // -------------------------------
  const cursor = document.createElement("div");
  cursor.className = "custom-cursor";
  document.body.appendChild(cursor);

  document.addEventListener("mousemove", (e) => {
    cursor.style.left = `${e.clientX}px`;
    cursor.style.top = `${e.clientY}px`;
  });

  addHoverEffect();
  setInterval(addHoverEffect, 2000);
});

// Tema oscuro/claro
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'light';

// Aplica el tema guardado al cargar la página
document.documentElement.setAttribute('data-theme', currentTheme);
updateIcon();

// Alternar tema al hacer clic
themeToggle.addEventListener('click', () => {
  const newTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateIcon();
});

// Actualizar icono según el tema
function updateIcon() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  themeToggle.setAttribute('aria-label', isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
}


// =============================================
// FUNCIONES PRINCIPALES
// =============================================

// -------------------------------
// PROYECTOS (desde JSON)
// -------------------------------
async function loadProjects() {
  try {
    const response = await fetch("projects.json");
    const projects = await response.json();
    const container = document.getElementById("projects-container");

    container.innerHTML = projects
      .map(
        (project) => `
      <div class="project-card" data-category="${project.category}">
        <div class="project-preview">
          <img src="${project.image}" alt="${
          project.alt
        }" class="project-image">
          <div class="project-hover">
            <a href="${project.github}" target="_blank" class="preview-btn">
              <i class="fab fa-github"></i> Code
            </a>
            ${
              project.demo
                ? `<button class="preview-btn demo-btn" data-demo="${
                    project.demo
                  }">
                <i class="${
                  project.live
                    ? "fas fa-external-link-alt"
                    : project.category === "app"
                    ? "fas fa-mobile-alt"
                    : "fas fa-play"
                }"></i> 
                ${
                  project.live
                    ? "Live"
                    : project.category === "app"
                    ? "Preview"
                    : "Demo"
                }
              </button>`
                : project.live
                ? `<a href="${project.live}" target="_blank" class="preview-btn demo-btn">
                <i class="fas fa-external-link-alt"></i> Live
              </a>`
                : ""
            }
          </div>
        </div>
        <div class="project-info">
          <h3>${project.title}</h3>
          <div class="project-tech">
            ${project.tags
              .map((tag) => `<span class="tech-tag">${tag}</span>`)
              .join("")}
          </div>
          <p>${project.description}</p>
          <div class="project-stats">
            ${project.stats
              .map(
                (stat) =>
                  `<span><i class="${stat.icon}"></i> ${stat.text}</span>`
              )
              .join("")}
          </div>
        </div>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading projects:", error);
    document.getElementById("projects-container").innerHTML = `
      <p class="error-message">⚠️ Error loading projects. Please refresh the page.</p>
    `;
  }
}

// -------------------------------
// EDUCACIÓN (desde JSON)
// -------------------------------
async function loadEducation() {
  try {
    const response = await fetch("education.json");
    const education = await response.json();
    const container = document.getElementById("timeline-container");

    container.innerHTML = education
      .map(
        (item, index) => `
      <div class="timeline-item ${index % 2 === 0 ? "even" : "odd"}">
        <div class="timeline-date">${item.period}</div>
        <div class="timeline-content">
          ${item.icon ? `<i class="${item.icon} timeline-icon"></i>` : ""}
          <h3>${item.title}</h3>
          <h4>${item.institution}</h4>
          <p>${item.description}</p>
          ${
            item.tags
              ? `
            <div class="education-tags">
              ${item.tags
                .map((tag) => `<span class="tag">${tag}</span>`)
                .join("")}
            </div>
          `
              : ""
          }
        </div>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Error loading education:", error);
    document.getElementById("timeline-container").innerHTML = `
      <p class="error-message">⚠️ Error loading education data.</p>
    `;
  }
}

// -------------------------------
// CERTIFICACIONES (nueva versión similar a proyectos)
// -------------------------------
async function loadCertifications() {
  try {
    const response = await fetch("certifications.json");
    const certifications = await response.json();
    const container = document.getElementById("certifications-container");

    container.innerHTML = certifications
      .map(
        (cert) => `
      <div class="project-card">
        <div class="project-preview">
          <img src="${cert.badge}" alt="${cert.title || "Certification badge"}" 
               class="project-image" onerror="this.src='assets/various/error-default.jpg'">
          <div class="project-hover">
            <a href="${
              cert.url
            }" target="_blank" rel="noopener" class="preview-btn demo-btn">
              <i class="fas fa-external-link-alt"></i> View Certificate
            </a>
          </div>
        </div>
        <div class="project-info">
          <h3>${cert.title || "Certification"}</h3>
          <div class="project-tech">
            ${cert.skills
              .map((skill) => `<span class="tech-tag">${skill}</span>`)
              .join("")}
          </div>
          <p>Issued by ${cert.platform} in ${cert.date}</p>
          <div class="project-stats">
            <span><i class="${getPlatformIconClass(cert.platform)}"></i> ${
          cert.platform
        }</span>
          </div>
        </div>
      </div>
    `
      )
      .join("");
  } catch (error) {
    console.error("Failed to load certifications:", error);
    document.getElementById("certifications-container").innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Could not load certifications. <button onclick="loadCertifications()">Retry</button></p>
      </div>
    `;
  }
}

function getPlatformIconClass(platform) {
  const platformIcons = {
    Coursera: "fas fa-university",
    Udemy: "fab fa-udemy",
    "Amazon Web Services": "fab fa-aws",
    default: "fas fa-certificate",
  };
  return platformIcons[platform] || platformIcons.default;
}

// -------------------------------
// FILTRADO DE PROYECTOS
// -------------------------------
function setupProjectFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

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

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      filterButtons.forEach((btn) => btn.classList.remove("active"));
      this.classList.add("active");
      filterProjects(this.dataset.filter);
    });
  });
}

// -------------------------------
// MODAL PARA DEMOS
// -------------------------------
function setupModal() {
  const modal = document.getElementById("demo-modal");
  const modalVideo = document.getElementById("modal-video");
  const closeModal = document.querySelector(".close-modal");

  // Delegación de eventos para botones dinámicos
  document.addEventListener("click", function (e) {
    const demoBtn = e.target.closest(".demo-btn");
    if (demoBtn && demoBtn.dataset.demo) {
      e.preventDefault();
      modal.style.display = "block";
      modalVideo.src = demoBtn.dataset.demo;
      document.body.style.overflow = "hidden";
    }
  });

  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
    modalVideo.pause();
    document.body.style.overflow = "auto";
  });

  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
      modalVideo.pause();
      document.body.style.overflow = "auto";
    }
  });
}

// -------------------------------
// CURSOR PERSONALIZADO
// -------------------------------
function addHoverEffect() {
  const cursor = document.querySelector(".custom-cursor");
  document
    .querySelectorAll("a, button, .btn, input, textarea, [onclick]")
    .forEach((el) => {
      el.addEventListener("mouseenter", () => cursor.classList.add("active"));
      el.addEventListener("mouseleave", () =>
        cursor.classList.remove("active")
      );
    });
}

// Función para cargar cursos desde JSON
async function loadCourses() {
  try {
    const response = await fetch("courses.json");
    const courses = await response.json();
    const container = document.querySelector(".courses-container");

    container.innerHTML = courses.map(course => `
      <div class="course-card">
        <h3>${course.name}</h3>
        <p><strong>Level:</strong> ${course.level}</p>
        <p><strong>Year:</strong> ${course.year}</p>
        <div class="course-skills">
          ${course.skills.map(skill => `<span class="tech-tag">${skill}</span>`).join("")}
        </div>
      </div>
    `).join("");
  } catch (error) {
    console.error("Error loading courses:", error);
  }
}
// Llama a la función al cargar la página
loadCourses();


// Contact Form Handling
document.getElementById('contactForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const submitBtn = form.querySelector('button[type="submit"]');
  
  // Feedback visual
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    
    if (response.ok) {
      // Redirección manual (como respaldo)
      window.location.href = form.querySelector('input[name="_next"]').value;
    } else {
      throw new Error('Form submission failed');
    }
  } catch (error) {
    // Mensaje de error si falla la redirección
    const errorMsg = document.createElement('p');
    errorMsg.className = 'form-error';
    errorMsg.innerHTML = '⚠️ Error sending message. Please try again.';
    form.appendChild(errorMsg);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = 'Send Message';
  }
});