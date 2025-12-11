/* ========================================
   Navigation JavaScript
   ======================================== */

/**
 * Initialize mobile navigation
 */
function initMobileNav() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!menuToggle || !sidebar) return;

  // Toggle menu on button click
  menuToggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen);

    if (overlay) {
      overlay.classList.toggle('is-visible', isOpen);
    }

    // Prevent body scroll when menu is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu when clicking overlay
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  }

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
      sidebar.classList.remove('is-open');
      if (overlay) {
        overlay.classList.remove('is-visible');
      }
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  // Close menu when window resizes to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && sidebar.classList.contains('is-open')) {
      sidebar.classList.remove('is-open');
      if (overlay) {
        overlay.classList.remove('is-visible');
      }
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Highlight current page in sidebar navigation
 */
function highlightCurrentPage() {
  const currentPath = window.location.pathname;
  const sidebarLinks = document.querySelectorAll('.sidebar-links a');

  sidebarLinks.forEach(link => {
    const linkPath = link.getAttribute('href');

    // Check if the link matches current page
    if (linkPath === currentPath ||
        (currentPath.endsWith('/') && linkPath === currentPath + 'index.html') ||
        (currentPath.endsWith('index.html') && linkPath === currentPath.replace('index.html', ''))) {
      link.classList.add('active');

      // Expand parent section if nested
      const parentSection = link.closest('.sidebar-section');
      if (parentSection) {
        parentSection.classList.add('is-expanded');
      }
    }
  });
}

/**
 * Initialize collapsible sidebar sections
 */
function initCollapsibleSections() {
  const sectionToggles = document.querySelectorAll('.sidebar-section-toggle');

  sectionToggles.forEach(toggle => {
    toggle.addEventListener('click', () => {
      const section = toggle.closest('.sidebar-section');
      section.classList.toggle('is-expanded');

      const isExpanded = section.classList.contains('is-expanded');
      toggle.setAttribute('aria-expanded', isExpanded);
    });
  });
}

/**
 * Highlight active section in main navigation
 */
function highlightMainNav() {
  const currentPath = window.location.pathname;
  const mainNavLinks = document.querySelectorAll('.main-nav .nav-link');

  mainNavLinks.forEach(link => {
    const linkPath = link.getAttribute('href');

    // Check if current path starts with link path (for section matching)
    if (currentPath.startsWith(linkPath) && linkPath !== '/') {
      link.classList.add('active');
    } else if (linkPath === '/' && currentPath === '/') {
      link.classList.add('active');
    }
  });
}

// Initialize all navigation functionality
document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  highlightCurrentPage();
  initCollapsibleSections();
  highlightMainNav();
});
