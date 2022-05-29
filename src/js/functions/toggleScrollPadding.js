function toggleScrollPadding(element, boolean) {
  if (!boolean) {
    element.style.paddingRight = 0;

    return;
  }

  let padding = `${window.innerWidth - document.body.offsetWidth}px`;

  element.style.paddingRight = padding;
}

export { toggleScrollPadding };
