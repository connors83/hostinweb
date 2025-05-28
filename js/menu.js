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