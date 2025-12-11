/* ========================================
   Main JavaScript
   ======================================== */

/**
 * Initialize copy-to-clipboard for code blocks
 */
function initCodeCopy() {
  const codeBlocks = document.querySelectorAll('pre');

  codeBlocks.forEach(block => {
    // Skip if already has a copy button
    if (block.querySelector('.copy-button')) return;

    // Create copy button
    const copyBtn = document.createElement('button');
    copyBtn.className = 'copy-button';
    copyBtn.textContent = 'Copy';
    copyBtn.setAttribute('aria-label', 'Copy code to clipboard');

    copyBtn.addEventListener('click', async () => {
      const code = block.querySelector('code');
      const text = code ? code.textContent : block.textContent;

      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('copied');

        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.classList.remove('copied');
        }, 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
        copyBtn.textContent = 'Failed';

        setTimeout(() => {
          copyBtn.textContent = 'Copy';
        }, 2000);
      }
    });

    block.style.position = 'relative';
    block.appendChild(copyBtn);
  });
}

/**
 * Generate table of contents from headings
 */
function initTableOfContents() {
  const article = document.querySelector('.article-body, .content-article');
  const tocContainer = document.querySelector('.toc-list');

  if (!article || !tocContainer) return;

  const headings = article.querySelectorAll('h2, h3');

  if (headings.length === 0) {
    // Hide TOC if no headings
    const tocWrapper = tocContainer.closest('.toc');
    if (tocWrapper) {
      tocWrapper.style.display = 'none';
    }
    return;
  }

  const tocItems = [];

  headings.forEach((heading, index) => {
    // Add ID if missing
    if (!heading.id) {
      heading.id = `heading-${index}`;
    }

    tocItems.push({
      level: heading.tagName.toLowerCase(),
      text: heading.textContent,
      id: heading.id
    });
  });

  // Generate TOC HTML
  tocContainer.innerHTML = tocItems.map(item => `
    <li class="toc-${item.level}">
      <a href="#${item.id}">${item.text}</a>
    </li>
  `).join('');

  // Initialize scroll spy
  initScrollSpy(headings);
}

/**
 * Scroll spy - highlight TOC item based on scroll position
 */
function initScrollSpy(headings) {
  const tocLinks = document.querySelectorAll('.toc-list a');

  if (!tocLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Remove active class from all links
          tocLinks.forEach(link => link.classList.remove('active'));

          // Add active class to current section's link
          const id = entry.target.id;
          const activeLink = document.querySelector(`.toc-list a[href="#${id}"]`);
          if (activeLink) {
            activeLink.classList.add('active');
          }
        }
      });
    },
    {
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    }
  );

  headings.forEach(heading => observer.observe(heading));
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');

      // Skip if just "#"
      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const headerHeight = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        // Update URL without scrolling
        history.pushState(null, null, href);
      }
    });
  });
}

/**
 * Add external link indicators
 */
function initExternalLinks() {
  const links = document.querySelectorAll('a[href^="http"]');

  links.forEach(link => {
    // Skip if already processed or is internal
    if (link.classList.contains('external-link-processed')) return;
    if (link.hostname === window.location.hostname) return;

    link.classList.add('external-link-processed');
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
  });
}

/**
 * Back to top button
 */
function initBackToTop() {
  const backToTop = document.querySelector('.back-to-top');

  if (!backToTop) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      backToTop.classList.add('is-visible');
    } else {
      backToTop.classList.remove('is-visible');
    }
  });

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Initialize reading progress indicator
 */
function initReadingProgress() {
  const progressBar = document.querySelector('.reading-progress');

  if (!progressBar) return;

  window.addEventListener('scroll', () => {
    const article = document.querySelector('.content-article');
    if (!article) return;

    const articleTop = article.offsetTop;
    const articleHeight = article.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollPosition = window.pageYOffset;

    const progress = Math.min(
      100,
      Math.max(0, ((scrollPosition - articleTop + windowHeight) / articleHeight) * 100)
    );

    progressBar.style.width = `${progress}%`;
  });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
  initCodeCopy();
  initTableOfContents();
  initSmoothScroll();
  initExternalLinks();
  initBackToTop();
  initReadingProgress();
});
