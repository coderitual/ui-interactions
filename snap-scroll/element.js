'use strict';

class Element {

  constructor() {
    this.onScroll = this.onScroll.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this._snapEnd = this._snapEnd.bind(this);

    this._scroll = document.querySelector('.scroll');
    this._scrollContainer = document.querySelector('.scroll__container');
    this._info = document.querySelector('.info');
    this.addEventListeners();

    this._currentScrollLeft = 0;
    this._scrollLeft = 0;
    this._userInteracts = false;

    this.pos = 0;

    for(let i = 0; i < 300; i++) {
      const item = document.createElement('figure');
      item.classList.add('scroll__item');
      item.classList.add(`js-item-${i}`);
      this._scrollContainer.appendChild(item);
    }

    this.raf = (dt) => {
      requestAnimationFrame(this.raf);
      this._speed = Math.abs(this._scrollLeft - this._scroll.scrollLeft);
      this._scrollLeft = this._scroll.scrollLeft;
      this._info.innerHTML = `scrollLeft: ${this._scroll.scrollLeft}, speed: ${this._speed}, user: ${this._userInteracts}`;
      this._snap();
    };
    this.raf();
  }

  onScroll(e) {
    this._currentScrollLeft = e.target.scrollLeft;
  }

  onTouchStart() {
    this._userInteracts = true;
    if (this._selectedElement) {
      this._selectedElement.classList.remove('scroll__item--selected');
    }

    const target = Math.floor(this._scrollLeft / 132) * 132 + 66;
    this._scrollContainer.classList.remove('scroll__container--animatable');
    this._scrollContainer.style.transform = `translateX(${0}px)`;
    this._scroll.scrollLeft = target;
  }

  onTouchEnd() {
    this._userInteracts = false;
  }

  _snap() {
    if(this._userInteracts) return;
    if (this._speed < 1) {
      const target = Math.floor(this._scrollLeft / 132) * 132 + 66;
      const selectedId = Math.floor(this._scrollLeft / 132);
      this._selectedElement = this._scroll.querySelector(`.js-item-${selectedId}`);
      this._selectedElement.classList.add('scroll__item--selected');

      this._scrollContainer.classList.add('scroll__container--animatable');
      this._scrollContainer.style.transform = `translateX(${this._scroll.scrollLeft - target}px)`;
    }
  }

  _snapEnd() {
    this._scrollContainer.removeEventListener('transitionend', this._snapEnd);
    this._animating = false;
  }

  addEventListeners() {
    this._scroll.addEventListener('scroll', this.onScroll);
    this._scroll.addEventListener('touchstart', this.onTouchStart);
    this._scroll.addEventListener('touchend', this.onTouchEnd);
  }

  removeEventListeners() {
  }

}

new Element();