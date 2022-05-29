class ValidationForm {
  constructor(form) {
    this._form = document.querySelector(form);
  }

  _listRules = new Map();
  _listValidateItems = new Map();
  _isValid = false;

  init() {
    this._listRules.set("minLength", this._minLength);
    this._listRules.set("maxLength", this._maxLength);
    this._listRules.set("text", this._text);
    this._listRules.set("requered", this._requered);
    this._listRules.set("email", this._email);
  }

  submit(cb) {
    this._form.addEventListener("submit", (e) => {
      e.preventDefault();

      this._checkValidate();

      if (!this._isValid) return;

      cb(e);
    });
  }

  addRules(selector, rules) {
    document.querySelectorAll(selector).forEach((element) => {
      this._setRule(element, rules);
    });
  }

  addCustomValidate(name, cb) {
    this._listRules.set(name, cb);
  }

  _setRule(element, rules) {
    let listValidateFunction = [];

    rules.forEach(({ rule, ...arg }) => {
      let func = this._listRules.get(rule);

      listValidateFunction.push(func.bind(null, { ...arg, element }));
    });

    this._listValidateItems.set(element, listValidateFunction);
  }

  _checkValidate() {
    let flag = true;

    for (let key of this._listValidateItems.keys()) {
      let rezult = this._checkValidateOneItem(key);

      if (!rezult) flag = false;
    }

    this._isValid = flag ? true : false;
  }

  _checkValidateOneItem(item) {
    let funcList = this._listValidateItems.get(item),
      errorMessage,
      flag = true;

    funcList.every((func) => {
      let { validate, errorMessage: message } = func();

      if (validate) {
        return true;
      } else {
        flag = !flag;
        errorMessage = message;
        return false;
      }
    });

    if (!flag) {
      this._showErrorMessage(item, errorMessage);

      return false;
    } else {
      this._hideErrorMessage(item);

      return true;
    }
  }

  _showErrorMessage(element, errorMessage) {
    this._showErrorMessageAfterInput(element, errorMessage);
  }

  _hideErrorMessage(element) {
    this._hideErrorMessageAfterInput(element);
  }

  _showErrorMessageAfterInput(element, errorMessage) {
    let errorMessageElement = element.nextElementSibling;

    this._searchErrorMessageElement(errorMessageElement, (errorElement) => {
      errorElement.textContent = errorMessage;
      element.classList.add("validate-error");
      errorElement.classList.add("validate-error-message_show");
    });
  }

  _hideErrorMessageAfterInput(element) {
    let errorMessageElement = element.nextElementSibling;

    this._searchErrorMessageElement(errorMessageElement, (errorElement) => {
      element.classList.remove("validate-error");
      errorElement.classList.remove("validate-error-message_show");
    });
  }

  _searchErrorMessageElement(errorElement, cb) {
    if (errorElement.classList.contains("validate-error-message")) {
      cb(errorElement);

      return;
    }

    this._searchErrorMessageElement(errorElement.nextElementSibling, cb);
  }

  _minLength({ element, value, errorMessage = null }) {
    let inputValue = element.value.trim();

    if (inputValue.length < value && inputValue !== "")
      return {
        validate: false,
        errorMessage,
      };

    return {
      validate: true,
    };
  }

  _maxLength({ element, value, errorMessage = null }) {
    let inputValue = element.value.trim();

    if (inputValue.length > value)
      return {
        validate: false,
        errorMessage,
      };

    return {
      validate: true,
    };
  }

  _requered({ element, errorMessage = null }) {
    let inputValue = element.value.trim();

    if (inputValue == "")
      return {
        validate: false,
        errorMessage,
      };

    return {
      validate: true,
    };
  }

  _text({ element, errorMessage = null }) {
    let inputValue = element.value.trim(),
      regexp = /[^a-zA-ZА-Яа-я]/;

    if (regexp.test(inputValue) && inputValue !== "")
      return {
        validate: false,
        errorMessage,
      };

    return {
      validate: true,
    };
  }

  _email({ element, errorMessage = null }) {
    let inputValue = element.value.trim(),
      regexp = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (regexp.test(inputValue) == false && inputValue !== "")
      return {
        validate: false,
        errorMessage,
      };

    return {
      validate: true,
    };
  }
}

export { ValidationForm };
