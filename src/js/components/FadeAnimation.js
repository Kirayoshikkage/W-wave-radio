class FadeAnimation {
  constructor({ display = "block", duration = 600 }) {
    this._display = display;
    this._duration = duration;
  }

  show(element = null) {
    if (!element || !(element instanceof HTMLElement)) return;

    element.style.display = this._display;

    return new Promise((resolve) => {
      setTimeout(() => {
        element.style.opacity = 1;
        element.style.visibility = "visible";

        resolve();
      }, 0);
    });
  }

  hide(element = null) {
    if (!element || !(element instanceof HTMLElement)) return;

    element.style.opacity = 0;
    element.style.visibility = "hidden";

    return new Promise((resolve) => {
      setTimeout(() => {
        element.style.display = "none";

        resolve();
      }, this._duration);
    });
  }

  getAnimationClass() {
    return "fade-animation";
  }
}

export { FadeAnimation };
