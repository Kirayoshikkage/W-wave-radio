function setEventKeydown(selector, key, cb) {
  document.querySelectorAll(selector).forEach((item) => {
    item.addEventListener("keydown", (e) => {
      if (e.key === key) {
        cb(e.target);
      }
    });
  });
}

export { setEventKeydown };
