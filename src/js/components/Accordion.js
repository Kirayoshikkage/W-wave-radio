class Accordion {
  constructor({ selector, initialValue = null }) {
    this.accordion = document.querySelector(selector);
    this.triggers = document.querySelectorAll(".accordion__trigger");
    this.activeElement = initialValue;
  }

  init() {
    if (this.activeElement)
      this._showElement(this.activeElement.querySelector(".accordion__body"));

    this.triggers.forEach((item) => {
      item.addEventListener("click", (e) => {
        this.toggleActive(e.target.closest(".accordion__item"));
      });
    });
  }

  toggleActive(item) {
    let body = item.querySelector(".accordion__body");

    if (!this.activeElement) {
      this.activeElement = item;

      this._showElement(body);

      return;
    }

    if (this.activeElement === item) {
      this._hideElement(body);

      this.activeElement = null;

      return;
    }

    this._hideElement(this.activeElement.querySelector(".accordion__body"));

    this.activeElement = item;

    this._showElement(body);
  }

  _showElement(item) {
    let height = item.scrollHeight;

    this.activeElement.classList.toggle("accordion__item_active");

    item.style.cssText = `
    max-height: ${height}px;
    overflow: ;
    visibility: visible;
    `;
  }

  resize(cb) {
    window.addEventListener("resize", cb);
  }

  updateHeight() {
    if (!this.activeElement) return;

    let item = this.activeElement.querySelector(".accordion__body"),
      height = item.scrollHeight;

    item.style.maxHeight = `${height}px`;
  }

  _hideElement(item) {
    this.activeElement.classList.toggle("accordion__item_active");

    item.style.cssText = `
    max-height: 0;
    overflow: hidden;
    visibility: hidden;
    `;
  }
}

export { Accordion };
