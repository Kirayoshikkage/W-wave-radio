function smoothScroll(selector) {
  const smoothLinks = document.querySelectorAll(selector);

  smoothLinks.forEach((item) => {
    item.addEventListener("click", scroll);
  });
}

function smoothScrollTabs(selector) {
  const smoothLinks = document.querySelectorAll(selector);

  smoothLinks.forEach((item) => {
    item.addEventListener("click", (e) => {
      let windowWidth = document.body.offsetWidth;

      if (windowWidth >= 768) return;

      scroll(e);
    });
  });
}

function scroll(e) {
  e.preventDefault();

  const element = e.target;
  const id = element.getAttribute("href");

  document.querySelector(id).scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export { smoothScroll, smoothScrollTabs };
