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

  loadCertifications();
});

// =============================================
// FUNCIONES PRINCIPALES
// =============================================

// -------------------------------
// PROYECTOS (desde JSON)
// -------------------------------
async function loadProjects() {
  try {
    const response = await fetch('projects.json');
    const projects = await response.json();
    const container = document.getElementById('projects-container');
    
    container.innerHTML = projects.map(project => `
      <div class="project-card" data-category="${project.category}">
        <div class="project-preview">
          <img src="${project.image}" alt="${project.alt}" class="project-image">
          <div class="project-hover">
            <a href="${project.github}" target="_blank" class="preview-btn">
              <i class="fab fa-github"></i> Code
            </a>
            ${project.demo ? 
              `<button class="preview-btn demo-btn" data-demo="${project.demo}">
                <i class="${project.live ? 'fas fa-external-link-alt' : project.category === 'mobile' ? 'fas fa-mobile-alt' : 'fas fa-play'}"></i> 
                ${project.live ? 'Live' : project.category === 'mobile' ? 'Preview' : 'Demo'}
              </button>` : 
              project.live ? 
              `<a href="${project.live}" target="_blank" class="preview-btn demo-btn">
                <i class="fas fa-external-link-alt"></i> Live
              </a>` : ''}
          </div>
        </div>
        <div class="project-info">
          <h3>${project.title}</h3>
          <div class="project-tech">
            ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
          </div>
          <p>${project.description}</p>
          <div class="project-stats">
            ${project.stats.map(stat => `<span><i class="${stat.icon}"></i> ${stat.text}</span>`).join('')}
          </div>
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading projects:', error);
    document.getElementById('projects-container').innerHTML = `
      <p class="error-message">⚠️ Error loading projects. Please refresh the page.</p>
    `;
  }
}

// -------------------------------
// EDUCACIÓN (desde JSON)
// -------------------------------
async function loadEducation() {
  try {
    const response = await fetch('education.json');
    const education = await response.json();
    const container = document.getElementById('timeline-container');
    
    container.innerHTML = education.map((item, index) => `
      <div class="timeline-item ${index % 2 === 0 ? 'even' : 'odd'}">
        <div class="timeline-date">${item.period}</div>
        <div class="timeline-content">
          ${item.icon ? `<i class="${item.icon} timeline-icon"></i>` : ''}
          <h3>${item.title}</h3>
          <h4>${item.institution}</h4>
          <p>${item.description}</p>
          ${item.tags ? `
            <div class="education-tags">
              ${item.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');
  } catch (error) {
    console.error('Error loading education:', error);
    document.getElementById('timeline-container').innerHTML = `
      <p class="error-message">⚠️ Error loading education data.</p>
    `;
  }
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
      filterButtons.forEach(btn => btn.classList.remove("active"));
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
  document.addEventListener('click', function(e) {
    const demoBtn = e.target.closest('.demo-btn');
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
  document.querySelectorAll("a, button, .btn, input, textarea, [onclick]").forEach((el) => {
    el.addEventListener("mouseenter", () => cursor.classList.add("active"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("active"));
  });
}

async function loadCertifications() {
  const container = document.getElementById('certifications-container');
  
  try {
    // 1. Cargar el JSON
    const response = await fetch('certifications.json');
    if (!response.ok) throw new Error('Network response was not ok');
    const certifications = await response.json();

    // 2. Generar HTML dinámico
    container.innerHTML = certifications.map(cert => `
      <div class="certification-card">
        <a href="${cert.url}" target="_blank" rel="noopener noreferrer">
          <img 
            src="${formatImagePath(cert.badge)}" 
            alt="${cert.title || 'Certification badge'}" 
            class="certification-badge"
            onerror="handleBadgeError(this)"
          >
        </a>
        <div class="certification-info">
          <h3>${cert.title || 'Untitled Certification'}</h3>
          <div class="certification-platform">
            ${getPlatformIcon(cert.platform)}
            <span>${cert.platform || 'Online Platform'} • ${cert.date || 'No date'}</span>
          </div>
          ${cert.skills ? `
            <div class="certification-skills">
              ${cert.skills.map(skill => `<span>${skill}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');

  } catch (error) {
    console.error('Failed to load certifications:', error);
    container.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <p>Could not load certifications. <button onclick="loadCertifications()">Retry</button></p>
      </div>
    `;
  }
}

async function loadCertifications() {
  const container = document.getElementById('certifications-container');
  
  try {
    // 1. Cargar el JSON de certificaciones
    const response = await fetch('certifications.json');
    if (!response.ok) throw new Error('Error al cargar certificaciones');
    const certifications = await response.json();

    // 2. Generar HTML dinámico con estilos mejorados
    container.innerHTML = certifications.map(cert => `
      <div class="certification-card">
        <!-- Contenedor de la imagen con efecto hover -->
        <div class="certification-preview">
          <img 
            src="${formatImagePath(cert.badge)}" 
            alt="${cert.title || 'Certificación'}" 
            class="certification-badge"
            onerror="handleBadgeError(this)"
            loading="lazy"
          >
          <!-- Efecto hover (similar a proyectos) -->
          <div class="certification-hover">
            <a href="${cert.url}" target="_blank" rel="noopener" class="preview-btn demo-btn">
              <i class="fas fa-external-link-alt"></i> Ver Certificado
            </a>
          </div>
        </div>
        
        <!-- Información de la certificación -->
        <div class="certification-info">
          <h3>${cert.title || 'Certificación'}</h3>
          <div class="certification-meta">
            ${getPlatformIcon(cert.platform)}
            <span class="certification-platform">${cert.platform || 'Plataforma'}</span>
            <span class="certification-date">${cert.date || ''}</span>
          </div>
          
          ${cert.skills?.length ? `
            <div class="certification-skills">
              ${cert.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
          ` : ''}
        </div>
      </div>
    `).join('');

    // 3. Añadir event listeners para efectos interactivos
    addCertificationHoverEffects();

  } catch (error) {
    console.error('Error:', error);
    showErrorMessage(container);
  }
}



// ======================================
// FUNCIONES AUXILIARES (COMPLETAS)
// ======================================

// Formatea la ruta de la imagen
function formatImagePath(path) {
  if (!path) return './assets/certifications/default-badge.png';
  
  // Elige una de estas opciones según tu estructura:
  
  // 1. Para rutas absolutas desde raíz:
  return path.startsWith('/') ? path : `/${path}`;
  
  // 2. Para GitHub Pages:
  // return `https://tuusuario.github.io/turepo/${path.replace(/^\//, '')}`;
  
  // 3. Para rutas relativas:
  // return `./${path}`;
}

// Manejo de errores de imágenes
function handleBadgeError(img) {
  console.warn('Error cargando badge:', img.alt);
  img.src = './assets/certifications/default-badge.png';
  img.style.opacity = '0.8';
  img.onerror = null; // Evita bucles infinitos
}

// Íconos para plataformas
function getPlatformIcon(platform) {
  const icons = {
    'Udemy': 'fab fa-udemy',
    'Coursera': 'fas fa-university',
    'AWS': 'fab fa-aws',
    'Google': 'fab fa-google',
    'Microsoft': 'fab fa-microsoft',
    'LinkedIn Learning': 'fab fa-linkedin',
    'default': 'fas fa-certificate'
  };
  
  const iconClass = icons[platform] || icons.default;
  return `<i class="${iconClass}" title="${platform || 'Certificación'}"></i>`;
}

// Efectos hover dinámicos
function addCertificationHoverEffects() {
  const cards = document.querySelectorAll('.certification-card');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.querySelector('.certification-badge').style.transform = 'scale(1.05)';
    });
    
    card.addEventListener('mouseleave', () => {
      card.querySelector('.certification-badge').style.transform = 'scale(1)';
    });
  });
}

// Mensaje de error elegante
function showErrorMessage(container) {
  container.innerHTML = `
    <div class="certification-error">
      <i class="fas fa-exclamation-triangle"></i>
      <h3>No se pudieron cargar las certificaciones</h3>
      <p>Por favor intenta recargar la página o visita mi 
        <a href="https://www.linkedin.com/in/tuperfil" target="_blank">LinkedIn</a>
      </p>
      <button onclick="loadCertifications()" class="btn">
        <i class="fas fa-sync-alt"></i> Reintentar
      </button>
    </div>
  `;
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', loadCertifications);