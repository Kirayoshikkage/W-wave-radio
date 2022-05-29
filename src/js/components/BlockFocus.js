class BlockFocus {
  constructor({
    exceptionContainer = null,
    caching = true,
    single = null,
  } = {}) {
    this._exceptionContainer =
      typeof exceptionContainer === "string" ? exceptionContainer : null;
    this._caching = Boolean(caching);
    this._arrSingle = Array.isArray(single) ? single : null;
  }

  static _blocked = false;

  static _listBlockedElements = new Set();

  _listFunctionToBlock = [
    this._checkTabIndex,
    this._checkExceptionContainer.bind(this),
    this._checkDomElement.bind(this),
  ];

  toggleBlock() {
    if (BlockFocus._blocked) {
      this._unblockingElements();

      BlockFocus._blocked = false;

      return;
    }

    this._blockingElements();

    BlockFocus._blocked = true;
  }

  _blockingElements() {
    if (this._caching) {
      if (BlockFocus._listBlockedElements.size) {
        for (let element of BlockFocus._listBlockedElements) {
          element.setAttribute("tabIndex", -1);
        }

        return;
      }
    }

    document.querySelectorAll("*").forEach((element) => {
      if (this._iterateOverBlockingFunctions(element)) {
        element.setAttribute("tabIndex", -1);

        BlockFocus._listBlockedElements.add(element);
      }
    });
  }

  _unblockingElements() {
    for (let element of BlockFocus._listBlockedElements) {
      element.setAttribute("tabIndex", 0);
    }
  }

  _iterateOverBlockingFunctions(element) {
    return this._listFunctionToBlock.every((func) => func(element));
  }

  _checkTabIndex(element) {
    return element.tabIndex === 0 ? true : false;
  }

  _checkExceptionContainer(element) {
    return !element.closest(this._exceptionContainer);
  }

  _checkDomElement(element) {
    return !this._arrSingle?.some((item) => item === element);
  }

  addBlockingFunction(func) {
    if (typeof func !== "function") return;

    this._listFunctionToBlock.push(func);
  }

  blocked() {
    return BlockFocus._blocked;
  }
}

export { BlockFocus };
