    // Start Menu Movil
    document.addEventListener('DOMContentLoaded', function () {
    const navbarCollapse = document.getElementById('navbarCollapse');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const dropdownToggles = document.querySelectorAll('.nav-item.dropdown > .nav-link');

    if (!navbarCollapse || !navbarToggler || dropdownToggles.length === 0) {
        return; // Salir si no hay navbar
    }

    let lastClicked = null;
    let lastClickTime = 0;

    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function (e) {
            const now = new Date().getTime();
            const parent = this.parentElement;
            const dropdown = parent.querySelector('.dropdown-menu');
            const icon = this.querySelector('.toggle-icon');

            if (lastClicked === this && now - lastClickTime < 400) {
                window.location.href = this.getAttribute('href');
                return;
            }

            e.preventDefault();
            lastClicked = this;
            lastClickTime = now;

            document.querySelectorAll('.nav-item.dropdown .dropdown-menu').forEach(menu => {
                if (menu !== dropdown) {
                    menu.classList.remove('show');
                    const otherIcon = menu.parentElement.querySelector('.toggle-icon');
                    if (otherIcon) otherIcon.classList.remove('rotated');
                }
            });

            const isOpen = dropdown.classList.toggle('show');
            if (icon) icon.classList.toggle('rotated', isOpen);
        });
    });

    document.addEventListener('click', function (e) {
        const clickInsideNavbar = e.target.closest('.navbar');
        const clickInsideMenu = e.target.closest('#navbarCollapse');
        const clickInsideToggler = e.target.closest('.navbar-toggler');

        document.querySelectorAll('.nav-item.dropdown .dropdown-menu').forEach(menu => {
            if (!clickInsideNavbar) {
                menu.classList.remove('show');
                const icon = menu.parentElement.querySelector('.toggle-icon');
                if (icon) icon.classList.remove('rotated');
            }
        });

        const isNavbarOpen = navbarCollapse.classList.contains('show');
        if (isNavbarOpen && !clickInsideMenu && !clickInsideToggler) {
            const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
            if (bsCollapse) {
                bsCollapse.hide();
            } else {
                new bootstrap.Collapse(navbarCollapse, { toggle: false }).hide();
            }
        }
    });

    document.querySelectorAll('.dropdown-menu .dropdown-item').forEach(item => {
        item.addEventListener('click', function () {
            document.querySelectorAll('.nav-item.dropdown .dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
                const icon = menu.parentElement.querySelector('.toggle-icon');
                if (icon) icon.classList.remove('rotated');
            });
        });
    });
});
// End Menu Movil

// Start Search Modal

document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  const resultsContainer = document.getElementById('searchResults');
  const spinner = document.getElementById('searchSpinner');
  const searchModal = document.getElementById('searchModal');
  const closeBtn = searchModal.querySelector('.btn-close');
  let data = [];

  // Cargar JSON y ordenar alfabéticamente
  fetch('/lib/search/data.json')
    .then(res => res.json())
    .then(json => {
      data = json.sort((a, b) => a.nombre.localeCompare(b.nombre));
    });

  // Función para resaltar coincidencias
  const resaltar = (texto, busqueda) => {
    const regex = new RegExp(`(${busqueda})`, 'gi');
    return texto.replace(regex, '<mark>$1</mark>');
  };

  // Buscar con múltiples palabras
  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    resultsContainer.innerHTML = '';

    if (query.length === 0) return;

    spinner.classList.remove('d-none');

    setTimeout(() => {
      const keywords = query.split(/\s+/).filter(Boolean);
      const resultados = data.filter(item => {
        const texto = (item.nombre + ' ' + item.descripcion).toLowerCase();
        return keywords.every(palabra => texto.includes(palabra));
      });

      const html = resultados.map(item => {
        return `<a href="${item.url}" class="list-group-item list-group-item-action">
          <strong>${resaltar(item.nombre, query)}</strong><br>
          ${resaltar(item.descripcion, query)}
        </a>`;
      }).join('');

      resultsContainer.innerHTML = `<div class="list-group">${html || '<div class="text-muted px-3">No se encontraron resultados.</div>'}</div>`;
      spinner.classList.add('d-none');
    }, 200);
  });

  // Enfocar input al abrir modal
  searchModal.addEventListener('shown.bs.modal', () => {
    setTimeout(() => input.focus(), 100);
  });

  // Evitar error de accesibilidad
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('modal-open')) {
      input.blur();
      document.body.focus();
    }
  });

  closeBtn.addEventListener('click', () => {
    input.blur();
    document.body.focus();
  });

  searchModal.addEventListener('hide.bs.modal', () => {
    document.activeElement?.blur();
    document.body.focus();
  });

  searchModal.addEventListener('hidden.bs.modal', () => {
    input.value = '';
    resultsContainer.innerHTML = '';
    spinner.classList.add('d-none');
  });

  // Asegurar body con tabindex para accesibilidad
  if (!document.body.hasAttribute('tabindex')) {
    document.body.setAttribute('tabindex', '0');
  }
});





// End Search Modal




    

   
