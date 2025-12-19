import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css';

let aboutUsSwiper = null;

function updateNavigationState(swiper) {
  const prevEl = swiper?.navigation?.prevEl;
  const nextEl = swiper?.navigation?.nextEl;
  const prevBtn = Array.isArray(prevEl) ? prevEl[0] : prevEl;
  const nextBtn = Array.isArray(nextEl) ? nextEl[0] : nextEl;

  if (prevBtn && nextBtn) {
    prevBtn.disabled = swiper.isBeginning;
    nextBtn.disabled = swiper.isEnd;
  }
}

function initAboutUsSwiper() {
  const container = document.querySelector(
    '.about-us-section .about-us-swiper'
  );
  if (!container) return null;

  // Prevent double-initialization (e.g., HMR) which can cause double navigation calls
  if (container.swiper) {
    try {
      container.swiper.destroy(true, true);
    } catch (e) {
      // noop
    }
  }

  // Scope navigation/pagination to this container to avoid global selector matches
  const controls = container.querySelector('.about-us-swiper-controls');
  const nextBtnEl =
    controls?.querySelector('.about-us-swiper-button-next') || null;
  const prevBtnEl =
    controls?.querySelector('.about-us-swiper-button-prev') || null;
  const paginationEl =
    controls?.querySelector('.about-us-swiper-pagination') || null;

  const swiper = new Swiper(container, {
    modules: [Navigation, Pagination],
    loop: false,
    wrapperClass: 'about-us-swiper-wrapper',
    slideClass: 'about-us-swiper-slide',
    // Do not let Swiper attach navigation handlers automatically —
    // we'll wire our own handlers to avoid duplicate/stacked listeners
    pagination: {
      el: paginationEl,
      clickable: true,
    },
    slidesPerView: 1,
    spaceBetween: 20,
    breakpoints: {
      768: {
        slidesPerView: 1,
      },
      1280: {
        slidesPerView: 1,
      },
    },
    on: {
      init(s) {
        updateNavigationState(s);
      },
      slideChange() {
        updateNavigationState(swiper);
      },
    },
  });

  // Attach single custom handlers and keep references to remove later
  const addNavHandler = (btnEl, handlerName, fn) => {
    if (!btnEl) return;
    // remove previous handler if exists
    const prev = btnEl[handlerName];
    if (prev) {
      try {
        btnEl.removeEventListener('click', prev);
      } catch (e) {
        // noop
      }
    }
    btnEl[handlerName] = fn;
    btnEl.addEventListener('click', fn);
  };

  addNavHandler(nextBtnEl, '_aboutUsNext', (e) => {
    e.preventDefault();
    swiper.slideNext();
    updateNavigationState(swiper);
  });

  addNavHandler(prevBtnEl, '_aboutUsPrev', (e) => {
    e.preventDefault();
    swiper.slidePrev();
    updateNavigationState(swiper);
  });

  updateNavigationState(swiper);
  return swiper;
}

function runInit() {
  // Destroy previous instance if present to avoid duplicate event handlers
  if (aboutUsSwiper) {
    try {
      aboutUsSwiper.destroy(true, true);
    } catch (e) {
      // noop
    }
    aboutUsSwiper = null;
  }

  aboutUsSwiper = initAboutUsSwiper();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runInit);
} else {
  runInit();
}
