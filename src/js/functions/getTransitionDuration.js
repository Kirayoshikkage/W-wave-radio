function getTransitionDuration(element = null) {
  if (!element || !(element instanceof HTMLElement)) return null;

  let styleElement = window.getComputedStyle(element);

  return styleElement.transitionDuration
    ? parseFloat(styleElement.transitionDuration) * 1000
    : 0;
}

export { getTransitionDuration };
