class Tabs {
  constructor({ tabs, tabsContentWrapper, initialValue = null }) {
    this.tabs = document.querySelectorAll(tabs);
    this.tabsContentWrapper = document.querySelector(tabsContentWrapper);
    this.activeElement = initialValue;
    this._tabsContentWrapperStyle = getComputedStyle(this.tabsContentWrapper);
    this.animationDuration =
      parseFloat(this._tabsContentWrapperStyle.transitionDuration) * 1000;
  }

  init() {
    if (this.activeElement)
      this.showContent(this.activeElement.querySelector(".tabs__hide-content"));

    this.tabs.forEach((item) => {
      item.querySelectorAll(".tabs__trigger").forEach((trigger) => {
        trigger.addEventListener("click", (e) => {
          e.preventDefault();

          this.toggleActive(e.target.closest(".tabs__item"));
        });
      });
    });
  }

  toggleActive(item) {
    if (item === this.activeElement) return;

    this.fadeIn(this.tabsContentWrapper);

    setTimeout(() => {
      this.hideContent();

      this._toggleClassActive(item);

      this.showContent(item.querySelector(".tabs__hide-content"));

      this.fadeOut(this.tabsContentWrapper);
    }, this.animationDuration);
  }

  _toggleClassActive(item) {
    this.activeElement?.classList.toggle(".tabs__item_active");

    this.activeElement = item;

    this.activeElement.classList.toggle(".tabs__item_active");
  }

  showContent(content) {
    this.tabsContentWrapper.insertAdjacentHTML("beforeend", content.innerHTML);
  }

  hideContent() {
    this.tabsContentWrapper.textContent = ``;
  }

  fadeIn(item) {
    if (!item) return;

    item.style.opacity = 0;
  }

  fadeOut(item) {
    if (!item) return;

    item.style.opacity = 1;
  }

  resize(cb) {
    window.addEventListener("resize", cb);
  }
}

export { Tabs };
