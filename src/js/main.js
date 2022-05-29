import { ShowElements } from "./components/ShowElements";
import { SelectWithSingleChoice } from "./components/Select";
import { Accordion } from "./components/Accordion";
import { Tabs } from "./components/Tabs";
import { smoothScroll, smoothScrollTabs } from "./functions/smoothScroll";
import { BurgerMenu } from "./components/BurgerMenu";
import { EtherDrop } from "./components/EtherDrop";
import { ValidationForm } from "./components/ValidationForm";
import { ModalWithTrigger, ModalNoTrigger } from "./components/Modal";
import { setEventKeydown } from "./functions/setEventKeydown";
import { BlockFocus } from "./components/BlockFocus";
import { FadeAnimation } from "./components/FadeAnimation";
import { AnimationHeight } from "./components/AnimationHeight";

setEventKeydown(".custom-radio", "Enter", (item) => {
  item.querySelector("input").checked = true;
});

setEventKeydown(".custom-checkbox", "Enter", (item) => {
  let element = item.querySelector("input");
  element.checked = !element.checked;
});

smoothScroll(".smooth-scroll");
smoothScrollTabs(".guests .tabs__trigger");

const prodcastsShowElements = new ShowElements({
  hiddenElements: ".podcasts__item",
  trigger: ".podcasts__button",
  breakpoints: {
    0: {
      output: 4,
    },
    1024: {
      output: 8,
    },
  },
});

prodcastsShowElements.init();

const burgerMenu = new BurgerMenu({
  selector: ".burger-menu",
  trigger: ".header__burger-button",
  selectorActive: "burger-menu_active",
  triggerActive: "burger-button_active",
  apiAnimation: new FadeAnimation({
    display: "block",
    duration: 400,
  }),
  apiBlockFocus: new BlockFocus({
    exceptionContainer: ".burger-menu",
    single: [document.querySelector(".header__burger-button")],
  }),
});

burgerMenu.init();

const guestsAccordion = new Accordion({
  selector: ".guests__accordion",
  initialValue: document.querySelectorAll(".accordion__item")[0],
});

guestsAccordion.init();

const guestsTabs = new Tabs({
  tabs: ".guests__tabs",
  tabsContentWrapper: ".guests__tabs-content-wrapper",
  initialValue: document.querySelector(".tabs__item_active"),
});

guestsTabs.init();

const etherDrop = new EtherDrop({
  selector: ".header__ether-drop",
  trigger: ".header__ether-trigger",
  selectorActive: "ether-drop_active",
  triggerActive: "ether-trigger_active",
});

etherDrop.init();

const feedbackModal = new ModalNoTrigger({
  selector: ".feedback-modal",
  selectorActive: "feedback-modal_active",
  closeBtn: ".feedback-modal .modal__close",
  apiAnimation: new FadeAnimation({
    display: "flex",
    duration: 400,
  }),
  apiBlockFocus: new BlockFocus({
    exceptionContainer: ".feedback-modal",
  }),
});

feedbackModal.init();

const validationFormFeedback = new ValidationForm(".feedback");

validationFormFeedback.init();

validationFormFeedback.addRules(".feedback__input_text", [
  {
    rule: "text",
    errorMessage: "Поле может содержать только буквы!",
  },
  {
    rule: "maxLength",
    value: 21,
    errorMessage: "Максимальное значениe - 21 символ!",
  },
  {
    rule: "minLength",
    value: 2,
    errorMessage: "Минимальное значениe - 2 символа!",
  },
  {
    rule: "requered",
    errorMessage: "Необходимо заполнить это поле!",
  },
]);

validationFormFeedback.addRules(".feedback__input_email", [
  {
    rule: "email",
    errorMessage: "Введите корректный e-mail!",
  },
  {
    rule: "maxLength",
    value: 40,
    errorMessage: "Максимальное значениe - 40 символов!",
  },
  {
    rule: "minLength",
    value: 8,
    errorMessage: "Минимальное значениe - 8 символов!",
  },
  {
    rule: "requered",
    errorMessage: "Необходимо заполнить это поле!",
  },
]);

validationFormFeedback.submit((e) => {
  let formData = new FormData(e.target),
    modalTitle = document.querySelector(".feedback-modal .title");

  fetch("mail.php", {
    method: "POST",
    body: formData,
  })
    .then(() => {
      modalTitle.textContent = "Обращение успешно отправлено!";

      toggleClass(
        "feedback-modal__title_error",
        "feedback-modal__title_success"
      );

      toggleModal();

      e.target.reset();
    })
    .catch(() => {
      modalTitle.textContent = "Ошибка! Попробуйте еще раз.";

      toggleClass(
        "feedback-modal__title_success",
        "feedback-modal__title_error"
      );

      toggleModal();
    });

  function toggleModal() {
    feedbackModal.toggleState();

    setTimeout(() => {
      if (feedbackModal.isOpen()) feedbackModal.toggleState();
    }, 2500);
  }

  function toggleClass(removeClass, addClass) {
    modalTitle.classList.remove(removeClass);
    modalTitle.classList.add(addClass);
  }
});

const authorSelect = new SelectWithSingleChoice({
  selector: ".author-select",
  initialValue: "Дмитрий Гутенберг",
  apiAnimation: new AnimationHeight(),
  output: 3,
});

authorSelect.init();

const loginModal = new ModalWithTrigger({
  selector: ".login-modal",
  openBtns: ".login-trigger",
  closeBtn: ".login-modal .modal__close",
  selectorActive: "login-modal_active",
  apiAnimation: new FadeAnimation({
    display: "flex",
    duration: 400,
  }),
  apiBlockFocus: new BlockFocus({
    exceptionContainer: ".login-modal",
  }),
});

loginModal.init();

guestsAccordion.resize(() => {
  guestsAccordion.updateHeight();
});

/**
 *
 * На вертикалке много где криво (модалка логин и бургер меню как минимум)
 *
 */
