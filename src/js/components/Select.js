class Select {
  constructor({
    selector = null,
    apiAnimation = null,
    output = 6,
    breakpoints = null,
  } = {}) {
    this._select =
      typeof selector === "string" ? document.querySelector(selector) : null;

    this._apiAnimation =
      Object.prototype.toString.call(apiAnimation) === "[object Object]"
        ? apiAnimation
        : null;

    this._breakpoints =
      Object.prototype.toString.call(breakpoints) === "[object Object]"
        ? breakpoints
        : null;

    this._output = typeof output === "number" ? output : 6;

    this._trigger = this._select?.querySelector(".select__trigger");
    this._body = this._select?.querySelector(".select__body");
    this._content = this._select?.querySelector(".select__content");
    this._items = this._select?.querySelectorAll(".select__item");
    this._moreBtn = this._select?.querySelector(".select__more-btn");
    this._amountItems = this._items?.length;
  }

  _isOpen = false;

  _toggleBind = this.toggle.bind(this);

  _currentBreakpoint;

  _listUpdateProperties = new Map();

  _destroy;

  _destroyList = new Set([
    this._destroyTrigger.bind(this),
    this._destroyAnimationBody.bind(this),
    this._destroyOutput.bind(this),
    this._destroySelectActive.bind(this),
    this._destroyStyleBody.bind(this),
  ]);

  init() {
    if (!this._select) throw new Error("Invalid type passed");

    if (this._checkBreakpoints()) {
      this._currentBreakpoint = this._getActualBreakpoint();

      this.resize(() => {
        if (this._destroy) return;

        this._updateValues();
      });
    }

    this._setOutput();

    this._hide();

    this._destroy = false;

    if (this._apiAnimation) {
      this._body.classList.add(this._apiAnimation.getAnimationClass());
    }

    this._trigger.addEventListener("click", this._toggleBind);

    this.resize(() => {
      if (!this.isOpen() || this._destroy) return;

      this._apiAnimation.recalculationHeight(this._body);
    });
  }

  toggle(e) {
    if (this._isOpen) {
      this._hide();

      return;
    }

    this._show();
  }

  _show() {
    if (!this._apiAnimation) {
      this._body.style.display = "block";
    } else {
      this._apiAnimation.show(this._body);
    }

    this._isOpen = true;

    this._select.classList.add("select_active");
  }

  _hide() {
    if (!this._apiAnimation) {
      this._body.style.display = "none";
    } else {
      this._apiAnimation?.hide(this._body);
    }

    this._isOpen = false;

    this._select.classList.remove("select_active");
  }

  resize(cb) {
    window.addEventListener("resize", (e) => {
      cb(e);
    });
  }

  isOpen() {
    return this._isOpen;
  }

  _setOutput() {
    if (this._breakpoints) {
      let breakpointValues = this._getDataFromBreakpointList(
        this._currentBreakpoint
      );

      if (!breakpointValues["output"]) return;

      this._output = breakpointValues["output"];

      this._listUpdateProperties.set("output", [this._updateOutput.bind(this)]);
    } else if (!this._output) {
      this._hideMoreButton();

      return;
    }

    if (!this._checkOutput()) {
      this._hideMoreButton();

      return;
    }

    this._toggleVisibleItems();

    this._setStyleContentContainer();

    this._showMoreButton();

    this._showAmountHideElements();

    this._clickOnShowMoreBtn();
  }

  _updateOutput(value) {
    if (this._output === value) return;

    this._output = value;

    this._toggleVisibleItems();

    this._setStyleContentContainer();

    if (!this._checkOutput()) {
      this._hideMoreButton();

      return;
    }

    this._showMoreButton();

    this._showAmountHideElements();

    this._clickOnShowMoreBtn();
  }

  _checkOutput() {
    return this._amountItems > this._output;
  }

  _iterationOnItems(cb) {
    this._items.forEach((item, index) => cb(item, index));
  }

  _toggleVisibleItems() {
    this._iterationOnItems((item, index) => {
      if (index >= this._output) {
        item.style.display = "none";
      } else {
        item.style.display = "block";
      }
    });
  }

  _setStyleContentContainer() {
    let height = this._content.scrollHeight;

    this._content.style.cssText = `
      max-height:${height}px;
      overflow:hidden;
    `;
  }

  _showMoreButton() {
    this._moreBtn.style.display = "block";
  }

  _hideMoreButton() {
    this._moreBtn.style.display = "none";
  }

  _showAmountHideElements() {
    if (!this._moreBtn.querySelector(".select__more-btn-amount")) return;

    this._moreBtn.querySelector(".select__more-btn-amount").textContent = `${
      this._amountItems - this._output
    }`;
  }

  _clickOnShowMoreBtn() {
    this._moreBtn.addEventListener(
      "click",
      () => {
        this._iterationOnItems((item) => (item.style.display = "block"));

        this._content.style.overflow = "auto";

        this._moreBtn.dataset.open = "true";

        this._moreBtn.style.display = "none";
      },
      { once: true }
    );
  }

  _updateValues() {
    let breakpoint = this._getActualBreakpoint();

    if (breakpoint === this._currentBreakpoint) return;

    this._currentBreakpoint = breakpoint;

    let actualData = this._getDataFromBreakpointList(breakpoint);

    this._recordingActualValues(actualData);
  }

  _checkBreakpoints() {
    return this._breakpoints ? true : false;
  }

  _getActualBreakpoint() {
    let width = document.body.offsetWidth;

    return Object.keys(this._breakpoints).reduce((acc, current) => {
      if (width >= current) {
        acc = current;
      }

      return acc;
    }, 0);
  }

  _getDataFromBreakpointList(breakpoint) {
    return this._breakpoints[breakpoint];
  }

  _recordingActualValues(data) {
    for (let key in data) {
      let functions = this._listUpdateProperties.get(key);

      if (Array.isArray(functions)) {
        this._listUpdateProperties.get(key).forEach((func) => {
          func(data[key]);
        });
      } else {
        functions();
      }
    }
  }

  _addDestroy(func) {
    this._destroyList.add(func);
  }

  destroy() {
    this._destroy = true;

    for (let func of this._destroyList) {
      func();
    }
  }

  _destroyStyleBody() {
    this._body.style.cssText = "";
  }

  _destroySelectActive() {
    this._select.classList.remove("select_active");
  }

  _destroyTrigger() {
    this._trigger.removeEventListener("click", this._toggleBind);
  }

  _destroyAnimationBody() {
    if (this._apiAnimation) {
      this._body.classList.remove(this._apiAnimation.getAnimationClass());
    }
  }

  _destroyOutput() {
    this._moreBtn.dataset.open = false;

    this._moreBtn.style.display = "none";

    this._content.style.cssText = `
      max-height: 100%;
    `;

    this._iterationOnItems((item) => (item.style.display = "block"));
  }
}

class ASelectWithChoice extends Select {
  constructor({
    selector = null,
    apiAnimation = null,
    output = 6,
    breakpoints = null,
    initialValue = "Выберите значение",
  } = {}) {
    super({ selector, apiAnimation, output, breakpoints });
    this._initialValue =
      typeof initialValue === "string" ? initialValue : "Выберите значение";

    this._currentItemHTML = this._select?.querySelector(
      ".select__current-item"
    );
  }

  _currentValue; /* abstract */

  init() {
    super.init();

    this._insertInitialValue();
  }

  _insertInitialValue() {} /* Abstract */

  _showCurrentValue() {} /* Abstract */

  _setCurrentValue() {} /* Abstract */

  getCurrentValue() {} /* Abstract */
}

class SelectWithSingleChoice extends ASelectWithChoice {
  constructor(
    selector = null,
    apiAnimation = null,
    output = 1,
    breakpoints = null,
    initialValue = "Выберите значение"
  ) {
    super(selector, apiAnimation, initialValue, output, breakpoints);
  }

  _currentValue = "";
  _clickOnOptionBindThis = this._clickOnOption.bind(this);

  init() {
    super.init();

    this._content.addEventListener("click", this._clickOnOptionBindThis);

    this._addDestroy(this._destroyContentEvent.bind(this));
    this._addDestroy(this._destroyCurrentValue.bind(this));
  }

  _clickOnOption(e) {
    if (!e.target.classList.contains("select__item")) return;

    if (this._setCurrentValue(e.target, e.target.dataset.key)) this._hide();
  }

  _insertInitialValue() {
    let item = this._body.querySelector(`[data-key="${this._initialValue}"]`);

    if (item) {
      this._setCurrentValue(item, item.dataset.key);

      return;
    }

    this._currentItemHTML.classList.add("select__current-item_text");

    this._currentItemHTML.textContent = this._initialValue;
  }

  _setCurrentValue(element, item) {
    if (item === this._currentValue) return;

    if (this._currentValue) {
      let currentValue = this._body.querySelector(
        `[data-key="${this._currentValue}"]`
      );

      currentValue.classList.remove("select__item_selected");
      currentValue.disabled = false;
    }

    this._currentValue = item;

    element.classList.add("select__item_selected");
    element.disabled = true;

    this._showCurrentValue(element.textContent);

    return true;
  }

  _showCurrentValue(value) {
    this._currentItemHTML.textContent = value;
  }

  getCurrentValue() {
    return this._currentValue;
  }

  _destroyContentEvent() {
    this._content.removeEventListener("click", this._clickOnOptionBindThis);
  }

  _destroyCurrentValue() {
    document
      .querySelector(`[data-key="${this._currentValue}"]`)
      ?.classList.remove("select__item_selected");

    this._currentValue = "";
  }
}

export { SelectWithSingleChoice, Select };
