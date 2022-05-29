import { toggleScrollPadding } from "../functions/toggleScrollPadding";
import { getTransitionDuration } from "../functions/getTransitionDuration";

class BurgerMenu {
  constructor({
    selector = null,
    trigger = null,
    selectorActive = "open",
    triggerActive = "open",
    apiAnimation = null,
    apiBlockFocus = null,
  } = {}) {
    this._burgerMenu =
      typeof selector === "string" ? document.querySelector(selector) : null;

    this._trigger =
      typeof trigger === "string" ? document.querySelector(trigger) : null;

    this._closeLink = this._burgerMenu?.querySelectorAll(
      ".burger-menu__link_close"
    );

    this._triggerActive =
      typeof triggerActive === "string" ? triggerActive : "open";

    this._selectorActive =
      typeof selectorActive === "string" ? selectorActive : "open";

    this._apiAnimation =
      Object.prototype.toString.call(apiAnimation) === "[object Object]"
        ? apiAnimation
        : null;

    this._apiBlockFocus =
      Object.prototype.toString.call(apiBlockFocus) === "[object Object]"
        ? apiBlockFocus
        : null;
  }

  _disabled = false;
  _isOpen = false;
  _transitionDuration;

  init() {
    if (!this._burgerMenu || !this._trigger)
      throw new Error("Invalid type passed");

    this._transitionDuration = getTransitionDuration(this._burgerMenu) ?? 0;

    this._trigger.addEventListener("click", (e) => {
      if (this._disabled) return;

      this.toggleState();

      this._toggleDisabledTrigger();
    });

    this._burgerMenu.addEventListener("click", (e) => {
      if (e.target === this._burgerMenu && !this._disabled) {
        this.toggleState();

        this._toggleDisabledTrigger();
      }
    });

    this.resize(() => {
      let height = document.body.offsetWidth;

      if (height >= 1024 && this.isOpen()) this.toggleState();
    });

    this._closeLink?.forEach((item) => {
      item.addEventListener("click", () => {
        this.toggleState();
      });
    });
  }

  toggleState() {
    let body = document.body;

    if (!this._isOpen) {
      this._show();
    } else {
      this._hide();
    }

    this._toggleBlockFocus();

    toggleScrollPadding(body, this._isOpen);

    toggleScrollPadding(this._burgerMenu, this._isOpen);

    body.classList.toggle("overflow-hidden");

    this._burgerMenu.classList.toggle(this._selectorActive);

    this._trigger.classList.toggle(this._triggerActive);
  }

  _toggleDisabledTrigger() {
    this._disabled = true;

    let timer = new Promise((resolve) => {
      setTimeout(() => resolve(), this._transitionDuration);
    }).then(() => {
      this._disabled = false;
    });
  }

  _show() {
    this._apiAnimation?.show(this._burgerMenu);

    if (!this._apiAnimation) this._burgerMenu.style.display = "block";

    this._isOpen = true;
  }

  _hide() {
    this._apiAnimation?.hide(this._burgerMenu);

    if (!this._apiAnimation) this._burgerMenu.style.display = "none";

    this._isOpen = false;
  }

  isOpen() {
    return this._isOpen;
  }

  resize(cb) {
    window.addEventListener("resize", (e) => {
      cb(e);
    });
  }

  _toggleBlockFocus() {
    this._apiBlockFocus?.toggleBlock();
  }
}

export { BurgerMenu };
