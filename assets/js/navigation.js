/* ========================================
   Navigation JavaScript
   ======================================== */

/**
 * Inject dropdown menus for Cloud and App Deploy nav items
 */
function initDropdownNav() {
  const mainNav = document.querySelector('.main-nav');
  if (!mainNav) return;

  const path = window.location.pathname;

  // Build dropdown items from a base href (e.g. "../../cloud/") that is already
  // correctly relative to this page in the static HTML. This avoids guessing
  // the depth from window.location.pathname, which breaks under any base path
  // (e.g. GitHub Pages serves the site under "/CloudDevOps/").
  function buildLinks(baseHref, sectionName, providers) {
    // Strip the trailing "<sectionName>/" so we have the prefix only.
    const prefix = baseHref.replace(new RegExp(sectionName + '/?$'), '');
    return providers.map(p => {
      if (p.divider) return { divider: true };
      return {
        label: p.label,
        provider: p.provider,
        href: prefix + sectionName + (p.suffix || ''),
      };
    });
  }

  const cloudProviders = [
    { label: 'Cloud',         provider: 'all',   suffix: '/' },
    { divider: true },
    { label: 'Cloud (GCP)',   provider: 'gcp',   suffix: '/gcp/' },
    { label: 'Cloud (AWS)',   provider: 'aws',   suffix: '/aws/' },
    { label: 'Cloud (Azure)', provider: 'azure', suffix: '/azure/' },
  ];

  const appDeployProviders = [
    { label: 'App Deploy',         provider: 'all',   suffix: '/' },
    { divider: true },
    { label: 'App Deploy (GCP)',   provider: 'gcp',   suffix: '/gcp/' },
    { label: 'App Deploy (AWS)',   provider: 'aws',   suffix: '/aws/' },
    { label: 'App Deploy (Azure)', provider: 'azure', suffix: '/azure/' },
  ];

  function makeDropdown(toggleText, links, sectionName) {
    const wrapper = document.createElement('div');
    wrapper.className = 'nav-dropdown';

    // Active when the current URL contains "/<section>/" as a path segment,
    // regardless of any base path the site is served under.
    const isActive = path.includes('/' + sectionName + '/');

    const btn = document.createElement('button');
    btn.className = 'nav-dropdown-toggle' + (isActive ? ' active' : '');
    btn.innerHTML = `${toggleText}<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

    const menu = document.createElement('div');
    menu.className = 'nav-dropdown-menu';
    menu.setAttribute('role', 'menu');

    links.forEach(item => {
      if (item.divider) {
        const div = document.createElement('div');
        div.className = 'nav-dropdown-divider';
        div.setAttribute('role', 'separator');
        menu.appendChild(div);
        return;
      }
      const a = document.createElement('a');
      a.href = item.href;
      a.className = 'nav-dropdown-item';
      a.setAttribute('role', 'menuitem');
      // Build with DOM APIs (not innerHTML) so label/provider values can never
      // be interpreted as markup.
      const dot = document.createElement('span');
      dot.className = `provider-dot provider-dot-${item.provider}`;
      a.appendChild(dot);
      a.appendChild(document.createTextNode(item.label));
      menu.appendChild(a);
    });

    wrapper.appendChild(btn);
    wrapper.appendChild(menu);

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = wrapper.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen);
      // Close other dropdowns
      document.querySelectorAll('.nav-dropdown.is-open').forEach(d => {
        if (d !== wrapper) {
          d.classList.remove('is-open');
          d.querySelector('.nav-dropdown-toggle').setAttribute('aria-expanded', 'false');
        }
      });
    });

    return wrapper;
  }

  // Replace existing Cloud and App Deploy nav-links with dropdowns.
  // Use each link's own href as the source of truth for the relative prefix,
  // so dropdown items inherit the correct depth from the static HTML.
  const existingLinks = mainNav.querySelectorAll('.nav-link');
  existingLinks.forEach(link => {
    const href = link.getAttribute('href') || '';
    if (/(^|\/)cloud\/?$/.test(href)) {
      const links = buildLinks(href, 'cloud', cloudProviders);
      link.parentNode.replaceChild(makeDropdown('Cloud', links, 'cloud'), link);
    } else if (/(^|\/)app-deploy\/?$/.test(href)) {
      const links = buildLinks(href, 'app-deploy', appDeployProviders);
      link.parentNode.replaceChild(makeDropdown('App Deploy', links, 'app-deploy'), link);
    }
  });

  // Close dropdowns when clicking outside
  document.addEventListener('click', () => {
    document.querySelectorAll('.nav-dropdown.is-open').forEach(d => {
      d.classList.remove('is-open');
      const btn = d.querySelector('.nav-dropdown-toggle');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-dropdown.is-open').forEach(d => {
        d.classList.remove('is-open');
      });
    }
  });
}

/**
 * Initialize mobile navigation
 */
function initMobileNav() {
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const sidebar = document.querySelector('.sidebar');
  const overlay = document.querySelector('.sidebar-overlay');

  if (!menuToggle || !sidebar) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    if (overlay) overlay.classList.toggle('is-visible', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('is-open');
      overlay.classList.remove('is-visible');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
      sidebar.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-visible');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && sidebar.classList.contains('is-open')) {
      sidebar.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-visible');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

/**
 * Normalize a URL to a comparable path: resolve it against the current
 * document (so relative "../cloud/" hrefs become absolute), drop any
 * trailing "index.html", and ensure a trailing slash on directory paths.
 * This works regardless of the base path the site is served under
 * (e.g. GitHub Pages "/simcloud/"), which the previous raw-string
 * comparisons did not.
 */
function normalizePath(url) {
  let path;
  try {
    path = new URL(url, window.location.href).pathname;
  } catch (e) {
    return url;
  }
  path = path.replace(/index\.html$/, '');
  if (!path.endsWith('/') && !/\.[a-z0-9]+$/i.test(path)) path += '/';
  return path;
}

/**
 * Highlight current page in sidebar navigation
 */
function highlightCurrentPage() {
  const currentPath = normalizePath(window.location.href);
  const sidebarLinks = document.querySelectorAll('.sidebar-links a');

  sidebarLinks.forEach(link => {
    if (normalizePath(link.href) === currentPath) {
      link.classList.add('active');
      const parentSection = link.closest('.sidebar-section');
      if (parentSection) parentSection.classList.add('is-expanded');
    }
  });
}

/**
 * Highlight active section in main navigation
 */
function highlightMainNav() {
  const currentPath = normalizePath(window.location.href);
  const mainNavLinks = document.querySelectorAll('.main-nav .nav-link');

  mainNavLinks.forEach(link => {
    const linkPath = normalizePath(link.href);
    // Section root (e.g. ".../cloud/") is active when the current page lives
    // under it; the site root is active only on an exact match.
    const isRoot = linkPath === normalizePath(window.location.origin + '/');
    if (!isRoot && currentPath.startsWith(linkPath)) {
      link.classList.add('active');
    } else if (isRoot && currentPath === linkPath) {
      link.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initDropdownNav();
  initMobileNav();
  highlightCurrentPage();
  highlightMainNav();
});
