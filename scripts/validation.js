const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn-disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible"
}

const showInputError = (formEl, inputEl, errorMsg) => {
    const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
    errorMsgEl.textContent = errorMsg;
    inputEl.classList.add(config.inputErrorClass);
};

const hideInputError = (formEl, inputEl,) => {
    const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
    errorMsgEl.textContent = "";
    inputEl.classList.remove(config.inputErrorClass);

};

const checkInputValidity = (formEl, inputEl, config) => {
    if (!inputEl.validity.valid) {
        showInputError(formEl, inputEl, inputEl.validationMessage, config);
    } else {
       hideInputError(formEl, inputEl, config); 
    }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonEl) => {
  console.log(hasInvalidInput(inputList));
   if (hasInvalidInput(inputList)) {
    disableButton(buttonEl);
  } else {
    buttonEl.disabled = false;
    buttonEl.classList.remove(config.inactiveButtonClass);
  }
};

const disableButton = (buttonEl, config) => {
  buttonEl.disabled = true;
};


const resetValidation = (formEl, inputList) => {
  inputList.forEach((input) => {
    hideInputError(formEl, input)
  })
};

const setEventListeners = (formEl, config) => {
    const inputList = Array.from(formEl.querySelectorAll(config.inputSelector));
    const buttonElement = formEl.querySelector(config.submitButtonSelector);

     toggleButtonState(inputList, buttonElement, config);
  
    inputList.forEach((inputElement) => {
      inputElement.addEventListener("input", function () {
        checkInputValidity(formEl, inputElement, config);
        toggleButtonState(inputList, buttonElement, config);
      });
    });
}

const enableValidation = (config) => {
    const formList = document.querySelectorAll(config.formSelector);
    formList.forEach((formEl) => {
      setEventListeners(formEl, config);  
    })
};

enableValidation(settings);

