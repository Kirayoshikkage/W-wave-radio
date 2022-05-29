import { animationZIndex } from "../functions/animationZIndex";

class EtherDrop {
  constructor({
    selector,
    trigger,
    selectorActive,
    triggerActive,
    animationDuration = null,
  }) {
    this._etherDrop = document.querySelector(selector);
    this._trigger = document.querySelector(trigger);
    this._selectorActive = selectorActive;
    this._triggerActive = triggerActive;
    this._animationDuration = animationDuration;
    this._etherDropStyle = getComputedStyle(this._etherDrop);
    this._status = false;
    this._disabledEtherDrop = false;
  }

  init() {
    if (!this._animationDuration) this._setAnimationDurationFromStyle();

    this._trigger.addEventListener("click", (e) => {
      if (e.target.disabled) return;

      e.preventDefault();

      this.toggleEtherDrop();
      this._toggleDisabled();
    });
  }

  toggleEtherDrop() {
    if (this._disabledEtherDrop) return;

    this._status = !this._status;

    this._animation();

    this._etherDrop.classList.toggle(this._selectorActive);
    this._trigger.classList.toggle(this._triggerActive);
  }

  _toggleDisabled() {
    this._disabledEtherDrop = true;

    setTimeout(() => {
      this._disabledEtherDrop = false;
    }, this._animationDuration);
  }

  _setAnimationDurationFromStyle() {
    this._animationDuration =
      parseFloat(this._etherDropStyle.transitionDuration) * 1000;
  }

  _animation() {
    animationZIndex({
      element: this._etherDrop,
      boolean: this._status,
      duration: this._animationDuration,
      value: 50,
    });
  }
}

export { EtherDrop };
