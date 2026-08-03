/*
 * Shopco - minimal scroll-snap carousel.
 *
 * Progressive enhancement only: the track is a natively scrollable element, so
 * touch, trackpad and keyboard scrolling all work with JS disabled. This class
 * only adds the previous/next buttons and keeps their disabled state in sync.
 */
class ShopcoCarousel extends HTMLElement {
  connectedCallback() {
    this.track = this.querySelector('[data-shopco-carousel-track]');
    this.previousButton = this.querySelector('[data-shopco-carousel-previous]');
    this.nextButton = this.querySelector('[data-shopco-carousel-next]');

    if (!this.track) return;

    this.onScroll = this.updateButtons.bind(this);

    this.previousButton?.addEventListener('click', () => this.scrollByPage(-1));
    this.nextButton?.addEventListener('click', () => this.scrollByPage(1));
    this.track.addEventListener('scroll', this.onScroll, { passive: true });

    if ('ResizeObserver' in window) {
      this.resizeObserver = new ResizeObserver(this.onScroll);
      this.resizeObserver.observe(this.track);
    }

    this.updateButtons();
  }

  disconnectedCallback() {
    this.track?.removeEventListener('scroll', this.onScroll);
    this.resizeObserver?.disconnect();
  }

  get step() {
    const firstItem = this.track.firstElementChild;
    if (!firstItem) return this.track.clientWidth;

    const gap = parseFloat(getComputedStyle(this.track).columnGap) || 0;
    return firstItem.getBoundingClientRect().width + gap;
  }

  scrollByPage(direction) {
    this.track.scrollBy({ left: this.step * direction, behavior: 'smooth' });
  }

  updateButtons() {
    const { scrollLeft, scrollWidth, clientWidth } = this.track;
    // 1px tolerance absorbs sub-pixel rounding at the track ends.
    const atStart = scrollLeft <= 1;
    const atEnd = scrollLeft + clientWidth >= scrollWidth - 1;

    if (this.previousButton) this.previousButton.disabled = atStart;
    if (this.nextButton) this.nextButton.disabled = atEnd;
  }
}

if (!customElements.get('shopco-carousel')) {
  customElements.define('shopco-carousel', ShopcoCarousel);
}
