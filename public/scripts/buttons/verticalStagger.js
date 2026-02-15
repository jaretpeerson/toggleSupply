// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button")

  buttons.forEach((button) => {
    setupHoverReplace(button)
  })
})

function setupHoverReplace(button) {
  const originalText = button.textContent
  button.textContent = "" // Clear the button

  // Create wrapper for overflow hidden
  const textWrapper = document.createElement("div")
  textWrapper.classList.add("button-text-wrapper")

  // Create containers for original and duplicate letters
  const originalContainer = document.createElement("div")
  originalContainer.classList.add("letter-container", "original")

  const duplicateContainer = document.createElement("div")
  duplicateContainer.classList.add("letter-container", "duplicate")

  // Split text into letters and wrap each one
  const letters = originalText.split("")

  letters.forEach((letter) => {
    // Create original letter span
    const originalSpan = document.createElement("span")
    originalSpan.classList.add("letter")
    originalSpan.textContent = letter
    originalContainer.appendChild(originalSpan)

    // Create duplicate letter span
    const duplicateSpan = document.createElement("span")
    duplicateSpan.classList.add("letter")
    duplicateSpan.textContent = letter
    duplicateContainer.appendChild(duplicateSpan)
  })

  // Assemble the structure
  textWrapper.appendChild(originalContainer)
  textWrapper.appendChild(duplicateContainer)
  button.appendChild(textWrapper)

  // Set up hover animations
  button.addEventListener("mouseenter", () => {
    const originalLetters = originalContainer.querySelectorAll(".letter")
    const duplicateLetters = duplicateContainer.querySelectorAll(".letter")

    animateLetters(originalLetters, duplicateLetters, "enter")
  })

  button.addEventListener("mouseleave", () => {
    const originalLetters = originalContainer.querySelectorAll(".letter")
    const duplicateLetters = duplicateContainer.querySelectorAll(".letter")

    animateLetters(originalLetters, duplicateLetters, "leave")
  })

  // Set up touch animations
  button.addEventListener("touchstart", (event) => {
    event.preventDefault() // Prevent mouse events from firing

    const originalLetters = originalContainer.querySelectorAll(".letter")
    const duplicateLetters = duplicateContainer.querySelectorAll(".letter")

    animateLetters(originalLetters, duplicateLetters, "enter")
  })

  button.addEventListener("touchend", (event) => {
    event.preventDefault()

    const originalLetters = originalContainer.querySelectorAll(".letter")
    const duplicateLetters = duplicateContainer.querySelectorAll(".letter")

    animateLetters(originalLetters, duplicateLetters, "leave")
  })

  button.addEventListener("touchcancel", (event) => {
    event.preventDefault()

    const originalLetters = originalContainer.querySelectorAll(".letter")
    const duplicateLetters = duplicateContainer.querySelectorAll(".letter")

    animateLetters(originalLetters, duplicateLetters, "leave")
  })
}

function animateLetters(originalLetters, duplicateLetters, direction) {
  const staggerDelay = 30 // milliseconds between each letter

  originalLetters.forEach((letter, index) => {
    setTimeout(() => {
      if (direction === "enter") {
        letter.classList.add("move-up")
      } else {
        letter.classList.remove("move-up")
      }
    }, index * staggerDelay)
  })

  duplicateLetters.forEach((letter, index) => {
    setTimeout(() => {
      if (direction === "enter") {
        letter.classList.add("move-up")
      } else {
        letter.classList.remove("move-up")
      }
    }, index * staggerDelay)
  })
}
