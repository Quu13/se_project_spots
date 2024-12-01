export function renderLoading(
    isLoading,
    button,
    buttonText = "Save",
    loadingText = "Saving..."
  ) {
    if (isLoading) {
      button.textContent = loadingText;
    } else {
      button.textContent = buttonText;
    }
  }