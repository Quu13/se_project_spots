import { enableValidation, settings, disableButton, resetValidation } from "../scripts/validation.js";
import "./index.css";
import Api from "../utils/Api.js"
import { initialCards } from "../utils/constants.js";
import { handleSubmit } from "../utils/handleSubmit.js";
import { renderLoading } from "../utils/helpers.js";


const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c33c4733-4284-4378-a339-b7e63cf4cfd2",
    "Content-Type": "application/json"
  }
});


  api
  .getAppInfo()
  .then(([cards, userInfo]) => {
    cards.forEach((item) => {
      const cardElement = getCardElement(item);
      cardsList.append(cardElement);
    });

    profileName.textContent = userInfo.name;
    profileDescription.textContent = userInfo.about;

    avatarElement.src = userInfo.avatar;
  })
  .catch(console.error);


/* Profile elements! */
const editModalBtn = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const avatarModalBtn = document.querySelector(".profile__avatar-btn");
const avatarElement = document.querySelector(".profile__avatar");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

/* Edit Form elements! */
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector(
  "#profile-description-input"
);

/* Card Form Elements*/ 
const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

/* Avatar Form element*/
const avatarModal = document.querySelector("#modal-avatar-edit");
const avatarForm = avatarModal.querySelector(".avatar__form");
const avatarSubmitBtn = avatarModal.querySelector(".modal__submit-btn");
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarInput = avatarModal.querySelector("#modal-avatar-description-input");

// Delete form elements
const deleteModal = document.querySelector("#modal__delete")
const deleteForm = deleteModal.querySelector(".modal__form");
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteCancelBtn = deleteModal.querySelector(".modal__submit-btn_cancel");


/* select the modal! */
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const cardModalClosePreview = previewModal.querySelector(
  ".modal__close-btn_type_preview"
);

/* Card related elements! */
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

let selectedCard;
let selectedCardId;


/* Functions */
function handleModalOverlay(evt) {
  if (evt.target.classList.contains("modal_opened")) {
    closeModal(evt.target);
  }
}

function handleModalEscape(evt) {
  if (evt.key === "Escape") {
    const openedModal = document.querySelector(".modal_opened");
    closeModal(openedModal);
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  modal.addEventListener("click", handleModalOverlay);
  document.addEventListener("keydown", handleModalEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  modal.removeEventListener("click", handleModalOverlay);
  document.removeEventListener("keydown", handleModalEscape);
}

function handleEditFormSubmit(e) {
  function makeRequest() {
    return api
      .editUserInfo({
        name: editModalNameInput.value,
        about: editModalDescriptionInput.value,
      })
      .then((userData) => {
        console.log(userData);
        profileName.textContent = userData.name;
        profileDescription.textContent = userData.about;
        closeModal(editModal);
      });
  }

  handleSubmit(makeRequest, e, settings);
}



function handleAddCardSubmit(e) {
  function makeRequest() {
    const inputValues = {
      name: cardNameInput.value,
      link: cardLinkInput.value,
    };
    return api.addNewCard(inputValues).then((card) => {
      const cardElement = getCardElement(card);
      cardsList.prepend(cardElement);
      closeModal(cardModal);
    });
  }

  handleSubmit(makeRequest, e, settings);
}

function handleAvatarSubmit(evt) {
  function makeRequest() {
    return api.editAvatarInfo(avatarInput.value).then((data) => {
      if (data.avatar) {
        avatarElement.src = data.avatar;
        avatarElement.alt = "Updated Avatar";
      }
      closeModal(avatarModal);
    });
  }

  handleSubmit(makeRequest, evt, settings);
}

function handleDeleteSubmit(evt) {
  function makeRequest() {
    return api.deleteCard(selectedCardId).then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = null;
      closeModal(deleteModal);
    });
  }

  handleSubmit(makeRequest, evt, settings, false, "Deleting...");
}

function handleDeleteCard(cardElement, cardId) {
  selectedCard = cardElement;
  selectedCardId = cardId;
  openModal(deleteModal);
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardDeleteBtn = cardElement.querySelector(".card__delete-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  function handleLike(evt, id) {
    const isLiked = cardLikeBtn.classList.contains("card__like-btn_liked");
    api
      .changeLikeStatus(data._id, isLiked)
      .then((res) => {
        cardLikeBtn.classList.toggle("card__like-btn_liked", res.isLiked);
      })
      .catch(console.error);
    }  

  /* EventListeners!*/
  cardLikeBtn.addEventListener("click", handleLike);

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
    previewModalCaptionEl.textContent = data.name;
  });



  cardDeleteBtn.addEventListener("click", (evt) => {
    handleDeleteCard(cardElement, data._id);
  });


  return cardElement;
}

editModalBtn.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescriptionInput.value = profileDescription.textContent;
  resetValidation(
    editFormElement, 
    [editModalNameInput, editModalDescriptionInput],
    settings
  );
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardModalBtn.addEventListener("click", () => {
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

cardModalClosePreview.addEventListener("click", () => {
  closeModal(previewModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

avatarModalBtn.addEventListener("click", () => {
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});


editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit",handleDeleteSubmit)


enableValidation(settings);


