const formContainer = document.getElementById("form-container")
const form = document.getElementById("form")
const firstName = document.getElementById("firstName")
const lastName = document.getElementById("lastName")
const email = document.getElementById("email")
const message = document.getElementById("message")
const submissionMessage = document.querySelector(".submission-message")

const firstNameField = document.getElementById("firstNameField")
const lastNameField = document.getElementById("lastNameField")
const emailField = document.getElementById("emailField")
const messageField = document.getElementById("messageField")

function validateEmail(emailValue) {
  const trimmedEmail = emailValue.trim()

  if (trimmedEmail.length === 0) return false

  const hasAtSymbol = trimmedEmail.includes("@")
  if (!hasAtSymbol) return false

  const atPosition = trimmedEmail.indexOf("@")
  const lastAtPosition = trimmedEmail.lastIndexOf("@")

  // Only one @ symbol allowed
  if (atPosition !== lastAtPosition) return false

  // @ cannot be first or last character
  if (atPosition === 0 || atPosition === trimmedEmail.length - 1) return false

  const localPart = trimmedEmail.substring(0, atPosition)
  const domainPart = trimmedEmail.substring(atPosition + 1)

  // Local part (before @) must be at least 1 character
  if (localPart.length === 0) return false

  // Domain must have a dot and at least one character before and after it
  const hasDot = domainPart.includes(".")
  if (!hasDot) return false

  const dotPosition = domainPart.indexOf(".")
  const lastDotPosition = domainPart.lastIndexOf(".")

  // Dot cannot be first or last in domain
  if (dotPosition === 0 || lastDotPosition === domainPart.length - 1)
    return false

  // Must have at least one character before and after the dot
  const beforeDot = domainPart.substring(0, dotPosition)
  const afterDot = domainPart.substring(lastDotPosition + 1)

  if (beforeDot.length === 0 || afterDot.length === 0) return false

  return true
}

function validateName(nameValue) {
  const trimmedName = nameValue.trim()

  // Name must be at least 2 characters
  if (trimmedName.length < 2) return false

  // Name should only contain letters, hyphens, apostrophes, and spaces
  const namePattern = /^[a-zA-Z\s'-]+$/
  if (!namePattern.test(trimmedName)) return false

  // Name shouldn't be all spaces or special characters
  const hasAtLeastOneLetter = /[a-zA-Z]/.test(trimmedName)
  if (!hasAtLeastOneLetter) return false

  return true
}

function validateMessage(messageValue) {
  const trimmedMessage = messageValue.trim()

  // Message should contain at least one letter or number
  const hasContent = /[a-zA-Z0-9]/.test(trimmedMessage)
  if (!hasContent) return false

  return true
}

function validateField(field, fieldContainer, value, validationFunction) {
  const isValid = validationFunction(value)

  if (!isValid) {
    fieldContainer.classList.add("error")
    return false
  }

  fieldContainer.classList.remove("error")
  return true
}

function handleFormSubmission(event) {
  event.preventDefault()

  const isFirstNameValid = validateField(
    firstName,
    firstNameField,
    firstName.value,
    validateName,
  )
  const isLastNameValid = validateField(
    lastName,
    lastNameField,
    lastName.value,
    validateName,
  )
  const isEmailValid = validateField(
    email,
    emailField,
    email.value,
    validateEmail,
  )
  const isMessageValid = validateField(
    message,
    messageField,
    message.value,
    validateMessage,
  )

  const allFieldsValid =
    isFirstNameValid && isLastNameValid && isEmailValid && isMessageValid

  if (!allFieldsValid) return

  formContainer.classList.add("hidden")
  submissionMessage.classList.remove("hidden")
}

form.addEventListener("submit", handleFormSubmission)
