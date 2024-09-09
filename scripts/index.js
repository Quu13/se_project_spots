const initialCards = [
    {name: "Golden Gate Bridge",
     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg"},
    {name: "Val Thorens",
     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg"},
    {name: "Restaurant terrace", 
     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg"},
    {name: "An outdoor cafe", 
     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg"},
    {name: "A very long bridge, over the forest and through the trees", 
     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg"},
    {name: "Tunnel with morning light", 
     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg"},
    {name: "Mountain house", 
     link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg"},

];

// Profile elements
const editModalBtn = document.querySelector(".profile__edit-btn");
const cardModalBtn = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDescription = document.querySelector(".profile__description");

// Form elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescriptionInput = editModal.querySelector("#profile-description-input");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = cardModal.querySelector(".modal__form");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");


// select the modal
const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const cardModalClosepreview = previewModal.querySelector(".modal__close-btn_type_preview");
// Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function openModal(modal) {
    
    modal.classList.add("modal_opened");   
}

function closeModal(modal) {
    modal.classList.remove("modal_opened"); 
 }

function handleEditFormSubmit(evt) {
    evt.preventDefault();
    profileName.textContent = editModalNameInput.value;
    profileDescription.textContent = editModalDescriptionInput.value;
    closeModal(editModal);
}

    function handleAddCardSubmit(evt) {
        evt.preventDefault();
        const inputValues = {name: cardNameInput.value, link: cardLinkInput.value};
        const CardElement = getCardElement(inputValues);
        cardsList.prepend(CardElement);
        closeModal(cardModal);
    }


    function getCardElement(data) {
        const CardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
        const cardNameEl = CardElement.querySelector(".card__title");
        const cardImageEl = CardElement.querySelector(".card__image");
        const cardLikeBtn = CardElement.querySelector(".card__like-btn");
        const cardDeleteBtn = CardElement.querySelector(".card__delete-btn");
    
     
        cardNameEl.textContent = data.name;
        cardImageEl.src = data.link;
        cardImageEl.alt = data.name;

         cardLikeBtn.addEventListener("click", () => {
           cardLikeBtn.classList.toggle("card__like-btn_liked"); 
         });

         cardImageEl.addEventListener("click", () => {
            openModal(previewModal);
            previewModalImageEl.src = data.link;
            previewModalImageEl.textContent = data.name;
            previewModalImageEl.alt = data.name;
         })


         cardDeleteBtn.addEventListener("click", function () {
            CardElement.remove(".card");
          })
        
        
        return CardElement;
     }
     

    editModalBtn.addEventListener("click", () => {
    editModalNameInput.value = profileName.textContent;
    editModalDescriptionInput.value = profileDescription.textContent;
     openModal(editModal);
    });

    editModalCloseBtn.addEventListener("click", () =>{ 
    closeModal(editModal);
    });

    cardModalBtn.addEventListener("click", () => {
     openModal(cardModal);
    });

    cardModalCloseBtn.addEventListener("click", () =>{ 
    closeModal(cardModal);
    });

    cardModalClosepreview.addEventListener("click", () =>{ 
    closeModal(previewModal);
    });

    editFormElement.addEventListener("submit", handleEditFormSubmit);
    cardForm.addEventListener("submit", handleAddCardSubmit)

    initialCards.forEach((item) => {
        const CardElement = getCardElement(item);
        cardsList.append(CardElement);
    });

