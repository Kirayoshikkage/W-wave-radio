class AnimationHeight {
  show(element = null) {
    if (!element || !(element instanceof HTMLElement)) return;

    let height = element.scrollHeight;

    element.style.cssText = `
      max-height: ${height}px;
      visibility: visible;
    `;
  }

  hide(element = null) {
    if (!element || !(element instanceof HTMLElement)) return;

    element.style.cssText = `
      max-height: 0;
      overflow: hidden;
      visibility: hidden;
    `;
  }

  recalculationHeight(element = null) {
    if (!element || !(element instanceof HTMLElement)) return;

    let height = element.scrollHeight;

    if (height === parseFloat(element.style.maxHeight)) return;

    element.style.maxHeight = `${height}px`;
  }

  getAnimationClass() {
    return "animation-height";
  }
}

export { AnimationHeight };
