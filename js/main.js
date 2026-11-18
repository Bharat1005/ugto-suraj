/**
 * UGTO SURAJ — Main UI & Experience Interactions
 * Contemporary Indian Artwear Fashion Brand
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // --- 1. Gallery / Visual Showcase Controller ---
  const galleryItems = [
    {
      src: 'assets/hero-fashion.jpg',
      alt: 'UGTO SURAJ Editorial Lookbook — Models in Sandstone Courtyard wearing Terracotta Red & Cream T-shirts',
      badge: '01 / THE LOOKBOOK',
      title: 'Rooted in Culture',
      description: 'Contemporary silhouettes meeting timeless Indian art motifs.'
    },
    {
      src: 'assets/tshirt-detail.jpg',
      alt: 'UGTO SURAJ T-shirt Craft Detail — Heavyweight organic combed cotton with terracotta red rising sun motif',
      badge: '02 / ARTISANAL DETAIL',
      title: 'Craft & Fabric',
      description: '240 GSM organic combed cotton with authentic Gujarati sun prints.'
    },
    {
      src: 'assets/craft-story.jpg',
      alt: 'UGTO SURAJ Atelier & Roots — Hand-carved Indian block-printing stamps, raw linen, and golden threads',
      badge: '03 / THE ATELIER',
      title: 'Heirloom Roots',
      description: 'Centuries of folk block-printing traditions, reinterpreted.'
    }
  ];

  let currentGalleryIndex = 0;
  let galleryTimer = null;
  const autoPlayDelay = 7000; // 7 seconds

  const mainImage = document.getElementById('gallery-main-image');
  const badgeEl = document.getElementById('gallery-badge');
  const captionTitleEl = document.getElementById('gallery-caption-title');
  const captionDescEl = document.getElementById('gallery-caption-desc');
  const navDots = document.querySelectorAll('.gallery-dot');
  const prevBtn = document.getElementById('gallery-prev');
  const nextBtn = document.getElementById('gallery-next');
  const showcaseContainer = document.querySelector('.fashion-showcase');

  function updateGallery(index) {
    if (!mainImage) return;

    currentGalleryIndex = (index + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentGalleryIndex];

    // Smooth transition
    mainImage.style.opacity = '0';
    mainImage.style.transform = 'scale(0.98)';

    setTimeout(() => {
      mainImage.src = item.src;
      mainImage.alt = item.alt;
      if (badgeEl) badgeEl.textContent = item.badge;
      if (captionTitleEl) captionTitleEl.textContent = item.title;
      if (captionDescEl) captionDescEl.textContent = item.description;

      mainImage.style.opacity = '1';
      mainImage.style.transform = 'scale(1)';
    }, 250);

    // Update dots
    navDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentGalleryIndex);
      dot.setAttribute('aria-current', i === currentGalleryIndex ? 'true' : 'false');
    });

    // Notify analytics
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'gallery_slide_change',
        slide_index: currentGalleryIndex,
        slide_title: item.title,
        timestamp: new Date().toISOString()
      });
    }
  }

  function startAutoPlay() {
    stopAutoPlay();
    galleryTimer = setInterval(() => {
      updateGallery(currentGalleryIndex + 1);
    }, autoPlayDelay);
  }

  function stopAutoPlay() {
    if (galleryTimer) {
      clearInterval(galleryTimer);
      galleryTimer = null;
    }
  }

  if (navDots.length > 0) {
    navDots.forEach((dot) => {
      dot.addEventListener('click', function () {
        const idx = parseInt(this.getAttribute('data-index'), 10);
        updateGallery(idx);
        startAutoPlay();
      });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      updateGallery(currentGalleryIndex - 1);
      startAutoPlay();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      updateGallery(currentGalleryIndex + 1);
      startAutoPlay();
    });
  }

  if (showcaseContainer) {
    showcaseContainer.addEventListener('mouseenter', stopAutoPlay);
    showcaseContainer.addEventListener('mouseleave', startAutoPlay);

    // Touch swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    showcaseContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      stopAutoPlay();
    }, { passive: true });

    showcaseContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
      startAutoPlay();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 40;
      if (touchEndX < touchStartX - threshold) {
        updateGallery(currentGalleryIndex + 1);
      } else if (touchEndX > touchStartX + threshold) {
        updateGallery(currentGalleryIndex - 1);
      }
    }
  }

  startAutoPlay();


  // --- 2. Journey Drawer / Modal Controller ---
  const journeyDrawer = document.getElementById('journey-drawer');
  const openJourneyBtns = document.querySelectorAll('[data-action="open-journey"]');
  const closeJourneyBtns = document.querySelectorAll('[data-action="close-journey"]');
  const drawerBackdrop = document.querySelector('.journey-backdrop');
  let lastFocusedElement = null;

  function openJourney() {
    if (!journeyDrawer) return;
    lastFocusedElement = document.activeElement;
    journeyDrawer.classList.add('is-open');
    journeyDrawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Focus close button for accessibility
    const firstCloseBtn = journeyDrawer.querySelector('[data-action="close-journey"]');
    if (firstCloseBtn) firstCloseBtn.focus();

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'journey_modal_open',
        timestamp: new Date().toISOString()
      });
    }
  }

  function closeJourney() {
    if (!journeyDrawer) return;
    journeyDrawer.classList.remove('is-open');
    journeyDrawer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }

    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'journey_modal_close',
        timestamp: new Date().toISOString()
      });
    }
  }

  openJourneyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openJourney();
    });
  });

  closeJourneyBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeJourney();
    });
  });

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeJourney);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && journeyDrawer && journeyDrawer.classList.contains('is-open')) {
      closeJourney();
    }
  });


  // --- 3. VIP Journey Form Submission ---
  const vipForm = document.getElementById('vip-form');
  const formSuccess = document.getElementById('vip-form-success');

  if (vipForm) {
    vipForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const emailInput = document.getElementById('vip-email');
      const email = emailInput ? emailInput.value.trim() : '';

      if (email && email.indexOf('@') > 0) {
        if (window.dataLayer) {
          window.dataLayer.push({
            event: 'vip_story_signup',
            signup_type: 'journey_waitlist',
            timestamp: new Date().toISOString()
          });
        }

        vipForm.style.display = 'none';
        if (formSuccess) {
          formSuccess.style.display = 'block';
          formSuccess.setAttribute('aria-live', 'polite');
        }
      }
    });
  }


  // --- 4. Subtitle Gujarati Audio / Cultural Tooltip ---
  const cultureBadge = document.querySelector('.culture-badge');
  if (cultureBadge) {
    cultureBadge.setAttribute('title', 'ઉગતો સૂરજ — Symbol of Dawn, Renewal & Ancient Roots');
  }
});

