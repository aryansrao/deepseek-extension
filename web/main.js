/**
 * DeepSeek Extension Website - Main JavaScript
 *
 * This script handles dynamic functionality for the site, including:
 * - Navigation highlighting and interaction
 * - Card hover effects
 * - Image lightbox functionality
 * - Smooth scrolling
 * - Loading screen transitions
 */

document.addEventListener('DOMContentLoaded', function () {

  initNavbarEffect();
  initCardHoverEffects();
  initScreenshotLightbox();
  setupSmoothScrolling();

  const homeLink = document.querySelector('.extension-link[href="#home"]');
  if (homeLink) {
    setActiveNavLink(homeLink);
  }


  setTimeout(updateActiveLinkOnScroll, 200);


  window.addEventListener('scroll', updateActiveLinkOnScroll);
  window.addEventListener('resize', updateActiveLinkOnScroll);


  setTimeout(function () {
    const loader = document.querySelector('.loading-overlay');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }
  }, 1000);
});



/**
 * Initialize 3D hover effect for the navbar
 * Creates a perspective tilt effect based on mouse position
 */
function initNavbarEffect() {
  document.addEventListener('mousemove', (e) => {
    // Only apply effect on larger screens
    if (window.innerWidth > 768) {
      const navbar = document.querySelector('.extension-links');
      if (!navbar) return;

      // Calculate distance from mouse to navbar center
      const rect = navbar.getBoundingClientRect();
      const navbarX = rect.left + rect.width / 2;
      const navbarY = rect.top + rect.height / 2;

      // Calculate rotation angles based on mouse distance
      const distX = (e.clientX - navbarX) / (window.innerWidth / 2) * 5; // Max 5deg rotation
      const distY = (e.clientY - navbarY) / (window.innerHeight / 2) * 5;

      // Only apply effect when mouse is somewhat close to navbar (400px range)
      if (Math.abs(e.clientX - navbarX) < 400 && Math.abs(e.clientY - navbarY) < 400) {
        navbar.style.transform = `translate(-50%, ${-Math.abs(distY)}px) rotateX(${-distY}deg) rotateY(${distX}deg)`;
      } else {
        navbar.style.transform = 'translate(-50%, 0)';
      }
    }
  });
}

function initCardHoverEffects() {
  const cards = document.getElementById('cards');
  if (cards) {

    cards.addEventListener('mousemove', (e) => {
      const cardsCollection = document.getElementsByClassName('card');


      for (const card of cardsCollection) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;


        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      }
    });


    cards.addEventListener('mouseleave', () => {
      for (const card of document.getElementsByClassName('card')) {
        card.style.removeProperty('--mouse-x');
        card.style.removeProperty('--mouse-y');
      }
    });
  }
}

function initScreenshotLightbox() {
  const screenshotCards = document.querySelectorAll('.screenshot-card');
  if (screenshotCards.length === 0) return;

  screenshotCards.forEach(card => {
    card.addEventListener('click', function () {
      const img = this.querySelector('img');
      if (!img) return;


      const lightbox = document.createElement('div');
      lightbox.className = 'simple-lightbox';


      Object.assign(lightbox.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: '1000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer'
      });


      const fullImg = document.createElement('img');
      fullImg.src = img.src;
      fullImg.alt = img.alt || 'Screenshot';

      Object.assign(fullImg.style, {
        maxWidth: '90%',
        maxHeight: '90%',
        objectFit: 'contain',
        border: '2px solid rgba(255,255,255,0.1)',
        borderRadius: '8px',
        boxShadow: '0 5px 25px rgba(0,0,0,0.5)'
      });


      lightbox.appendChild(fullImg);
      document.body.appendChild(lightbox);


      lightbox.addEventListener('click', () => {
        document.body.removeChild(lightbox);
      });
    });
  });
}

function setupSmoothScrolling() {
  document.querySelectorAll('.extension-link[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {

        const offset = 20;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;


        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });


        setActiveNavLink(this);
      }
    });
  });
}

function updateActiveLinkOnScroll() {

  const scrollPosition = window.scrollY + window.innerHeight / 3;


  if (window.scrollY < 50) {
    const homeLink = document.querySelector('.extension-link[href="#home"]');
    if (homeLink) {
      setActiveNavLink(homeLink);
      return;
    }
  }


  const sections = Array.from(document.querySelectorAll('div[id]'));
  if (!sections.length) return;



  sections.sort((a, b) => a.offsetTop - b.offsetTop);


  let currentSection = null;

  for (let i = sections.length - 1; i >= 0; i--) {
    const section = sections[i];
    const sectionTop = section.offsetTop;


    if (scrollPosition >= sectionTop - 100) {
      currentSection = section;
      break;
    }
  }


  if (currentSection) {
    const sectionId = currentSection.getAttribute('id');
    const correspondingLink = document.querySelector(`.extension-link[href="#${sectionId}"]`);

    if (correspondingLink) {
      setActiveNavLink(correspondingLink);
    }
  }

  else if (sections.length > 0) {
    const homeLink = document.querySelector('.extension-link[href="#home"]');
    if (homeLink) {
      setActiveNavLink(homeLink);
    }
  }
}

/**

 * @param {HTMLElement} activeLink
 */
function setActiveNavLink(activeLink) {

  document.querySelectorAll('.extension-link').forEach(link => {
    link.classList.remove('active');
  });


  if (activeLink) {
    activeLink.classList.add('active');
  }
}
