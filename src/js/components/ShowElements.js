class ShowElements {
  constructor({
    hiddenElements = null,
    trigger = null,
    output,
    apiAnimation = null,
    breakpoints = null,
  } = {}) {
    this._hiddenElements =
      typeof hiddenElements === "string"
        ? document.querySelectorAll(hiddenElements)
        : null;

    this._trigger =
      typeof trigger === "string" ? document.querySelector(trigger) : null;

    this._output = output;

    this._apiAnimation =
      Object.prototype.toString.call(apiAnimation) === "[object Object]"
        ? apiAnimation
        : null;

    this._breakpoints =
      Object.prototype.toString.call(breakpoints) === "[object Object]"
        ? breakpoints
        : null;
  }

  _listUpdateProperties = new Map();

  _isOpen = false;

  _currentBreakpoint;

  init() {
    if (!this._hiddenElements || !this._trigger)
      throw new Error("Invalid type passed");

    this._trigger.addEventListener("click", (e) => {
      this.iterateOverHiddenElements((item, index) => {
        if (index >= this._output) {
          this.show(item);
        }
      });

      this.hide(e.target);

      this._isOpen = true;
    });

    if (this._checkBreakpoints()) {
      this._listUpdateProperties.set("output", [this._updateOutput.bind(this)]);

      this._updateValues();

      this.resize(() => {
        if (this._isOpen) return;

        this._updateValues();
      });
    } else {
      this._toggleHidden();
    }
  }

  iterateOverHiddenElements(cb) {
    this._hiddenElements.forEach((item, index) => {
      cb(item, index);
    });
  }

  show(element) {
    element.dataset.open = "true";

    if (this._apiAnimation) {
      this._apiAnimation.show(element);

      return;
    }

    element.style.display = "block";
  }

  hide(element) {
    element.dataset.open = "false";

    if (this._apiAnimation) {
      this._apiAnimation.hide(element);

      return;
    }

    element.style.display = "none";
  }

  _toggleHidden() {
    this.iterateOverHiddenElements((element, index) => {
      if (index < this._output) {
        this.show(element);
      } else {
        this.hide(element);
      }
    });
  }

  _updateOutput(value) {
    if (this._output === value) return;

    this._output = value;

    this._toggleHidden();
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

      if (typeof functions === "function") {
        functions();

        return;
      }

      functions.forEach((func) => {
        func(data[key]);
      });
    }
  }

  resize(cb) {
    window.addEventListener("resize", (e) => {
      cb(e);
    });
  }

  addUpdateProperties(name, arrayFunc) {
    if (typeof name !== "string") throw new Error("Invalid data type passed");

    if (typeof arrayFunc !== "function")
      throw new Error("Invalid data type passed");

    if (Array.isArray(arrayFunc)) {
      this._listUpdateProperties.set(name, arrayFunc);

      return;
    }

    this._listUpdateProperties.set(name, [arrayFunc]);
  }
}

export { ShowElements };
