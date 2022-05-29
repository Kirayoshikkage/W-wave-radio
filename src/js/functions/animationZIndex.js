function animationZIndex({ element, boolean, duration, value }) {
  if (!boolean) {
    setTimeout(() => {
      element.style.zIndex = -1;
    }, duration);
    return;
  }

  element.style.zIndex = value;
}

export { animationZIndex };
