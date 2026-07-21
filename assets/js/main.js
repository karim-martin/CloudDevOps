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
 * Wire up "go back" controls (e.g. the 404 page) without an inline
 * javascript: URL, so the site stays compatible with a strict CSP.
 */
function initHistoryBack() {
  document.querySelectorAll('[data-action="history-back"]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      history.back();
    });
  });
}

// Initialize all functionality
document.addEventListener('DOMContentLoaded', () => {
  initCodeCopy();
  initSmoothScroll();
  initExternalLinks();
  initHistoryBack();
});
