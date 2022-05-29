import { toggleScrollPadding } from "../functions/toggleScrollPadding";
import { getTransitionDuration } from "../functions/getTransitionDuration";

class AModal {
  constructor({
    selector = null,
    closeBtn = null,
    selectorActive = "open",
    apiAnimation = null,
    apiBlockFocus = null,
  } = {}) {
    this._Modal =
      typeof selector === "string" ? document.querySelector(selector) : null;

    this._closeBtn =
      typeof closeBtn === "string" ? document.querySelector(closeBtn) : null;

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

  _isOpen = false;
  _firstDiscovery = new CustomEvent("first-discovery");
  _transitionDuration;
  _listFuncForFirstDiscovery = new Set();

  init() {
    if (!this._Modal || !this._closeBtn) throw new Error("Invalid type passed");

    this._Modal.addEventListener(
      "first-discovery",
      () => {
        for (let func of this._listFuncForFirstDiscovery) {
          func();
        }
      },
      {
        once: true,
      }
    );

    this._transitionDuration = getTransitionDuration(this._Modal);

    this._Modal.addEventListener("click", (e) => {
      if (e.target === this._Modal && !this._disabled) {
        this.toggleState();
      }
    });

    this._closeBtn.addEventListener("click", (e) => {
      this.toggleState();
    });
  }

  toggleState() {
    let body = document.body;

    if (!this._isOpen) {
      this._show();

      setTimeout(() => {
        this._closeBtn.focus();
      }, this._transitionDuration);
    } else {
      this._hide();
    }

    this._Modal.dispatchEvent(this._firstDiscovery);

    this._toggleBlockFocus();

    toggleScrollPadding(body, this._isOpen);

    toggleScrollPadding(this._Modal, this._isOpen);

    body.classList.toggle("overflow-hidden");

    this._Modal.classList.toggle(this._selectorActive);
  }

  _show() {
    this._apiAnimation?.show(this._Modal);

    if (!this._apiAnimation) this._Modal.style.display = "block";

    this._isOpen = true;
  }

  _hide() {
    this._apiAnimation?.hide(this._Modal);

    if (!this._apiAnimation) this._Modal.style.display = "none";

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

  eventFirstDiscovery(func) {
    this._listFuncForFirstDiscovery.add(func);
  }
}

class ModalNoTrigger extends AModal {
  constructor(
    selector = null,
    closeBtn = null,
    selectorActive = "open",
    apiAnimation = null,
    apiBlockFocus = null
  ) {
    super(selector, closeBtn, selectorActive, apiAnimation, apiBlockFocus);
  }
}

class ModalWithTrigger extends AModal {
  constructor({
    selector = null,
    openBtns = null,
    closeBtn = null,
    selectorActive = "open",
    apiAnimation = null,
    apiBlockFocus = null,
  } = {}) {
    super({ selector, closeBtn, selectorActive, apiAnimation, apiBlockFocus });

    this._openBtns =
      typeof openBtns === "string" ? document.querySelectorAll(openBtns) : null;
  }

  _disabled = false;

  init() {
    if (!this._openBtns) throw new Error("Invalid type passed");

    let event;

    super.init();

    this._openBtns.forEach((item) =>
      item.addEventListener("click", (e) => {
        if (this._disabled) return;

        this.toggleState();

        this._toggleDisabledTrigger();
      })
    );

    this._openBtns.forEach((item) =>
      item.addEventListener("keydown", (e) => {
        if (e.code !== "Enter" && e.code !== "Space") return;

        if (this._disabled) return;

        this.toggleState();

        this._toggleDisabledTrigger();
      })
    );
  }

  _toggleDisabledTrigger() {
    this._disabled = true;

    let timer = new Promise((resolve) => {
      setTimeout(() => resolve(), this._transitionDuration);
    }).then(() => {
      this._disabled = false;
    });
  }
}

export { ModalNoTrigger, ModalWithTrigger };
