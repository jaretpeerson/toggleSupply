const sections = document.querySelectorAll(".section-container")
let isScrolling = false
let currentSection = 0
let wheelAccumulator = 0
const wheelThreshold = 50

function scrollToSection(index) {
  if (index < 0 || index >= sections.length) return

  isScrolling = true
  currentSection = index

  gsap.to(window, {
    duration: 0.8,
    scrollTo: {
      y: sections[index],
      offsetY: 0,
    },
    ease: "expo.inOut",
    onComplete: () => {
      setTimeout(() => {
        isScrolling = false
        wheelAccumulator = 0
      }, 100)
    },
  })
}

function handleWheel(event) {
  event.preventDefault()

  if (isScrolling) return

  wheelAccumulator += event.deltaY

  if (Math.abs(wheelAccumulator) < wheelThreshold) return

  const direction = wheelAccumulator > 0 ? 1 : -1
  wheelAccumulator = 0

  const nextSection = currentSection + direction

  if (nextSection >= 0 && nextSection < sections.length) {
    scrollToSection(nextSection)
  }
}

function handleKeydown(event) {
  if (isScrolling) return

  if (event.key === "ArrowDown" || event.key === "PageDown") {
    event.preventDefault()
    scrollToSection(currentSection + 1)
  }

  if (event.key === "ArrowUp" || event.key === "PageUp") {
    event.preventDefault()
    scrollToSection(currentSection - 1)
  }
}

window.addEventListener("wheel", handleWheel, { passive: false })
window.addEventListener("keydown", handleKeydown)

// Handle touch devices
let touchStartY = 0

window.addEventListener(
  "touchstart",
  (event) => {
    touchStartY = event.touches[0].clientY
  },
  { passive: true }
)

window.addEventListener(
  "touchmove",
  (event) => {
    event.preventDefault()
  },
  { passive: false }
)

window.addEventListener(
  "touchend",
  (event) => {
    if (isScrolling) return

    const touchEndY = event.changedTouches[0].clientY
    const difference = touchStartY - touchEndY
    const threshold = 50

    if (Math.abs(difference) < threshold) return

    const direction = difference > 0 ? 1 : -1
    scrollToSection(currentSection + direction)
  },
  { passive: true }
)
