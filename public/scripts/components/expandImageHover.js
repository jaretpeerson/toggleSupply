const gallery = document.querySelector(".gallery")
const imageContainers = document.querySelectorAll(".image-container")

const baseFlex = 1
const maxFlex = 3
const smoothing = 0.08

const targetFlex = Array.from(imageContainers, () => baseFlex)
const currentFlex = Array.from(imageContainers, () => baseFlex)
let isHovering = false
let isAnimating = false

function updateFlex() {
  let isSettled = true

  for (let i = 0; i < currentFlex.length; i++) {
    const diff = targetFlex[i] - currentFlex[i]
    if (Math.abs(diff) > 0.001) {
      currentFlex[i] += diff * smoothing
      isSettled = false
    } else {
      currentFlex[i] = targetFlex[i]
    }
    imageContainers[i].style.flex = currentFlex[i]
  }

  if (!isSettled) {
    requestAnimationFrame(updateFlex)
  } else {
    isAnimating = false
  }
}

function startAnimating() {
  if (!isAnimating) {
    isAnimating = true
    requestAnimationFrame(updateFlex)
  }
}

function setTargets(mouseX) {
  const galleryBounds = gallery.getBoundingClientRect()
  const relativeX = mouseX - galleryBounds.left

  for (let i = 0; i < imageContainers.length; i++) {
    const bounds = imageContainers[i].getBoundingClientRect()
    const centerX = bounds.left + bounds.width / 2 - galleryBounds.left
    const distance = Math.abs(relativeX - centerX)
    const closeness = Math.max(0, 1 - distance / (galleryBounds.width * 0.3))
    targetFlex[i] = baseFlex + (maxFlex - baseFlex) * closeness * closeness
  }

  startAnimating()
}

gallery.addEventListener("mousemove", (event) => {
  isHovering = true
  setTargets(event.clientX)
})

gallery.addEventListener("mouseleave", () => {
  isHovering = false
  for (let i = 0; i < targetFlex.length; i++) {
    targetFlex[i] = baseFlex
  }
  startAnimating()
})